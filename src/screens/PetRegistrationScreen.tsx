import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { X, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useAuthStore } from "../store/authStore";
import { createPet, generateNextPetId } from "../utils/api/pets";
import { createNosePrint } from "../utils/api/nosePrints";
import { uploadImageToSupabase, generateImageHash } from "../utils/storage";

interface PetRegistrationScreenProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

type Step = 1 | 2;

export default function PetRegistrationScreen({
  onClose,
  onSuccess,
}: PetRegistrationScreenProps) {
  const [step, setStep] = useState<Step>(1);
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const user = useAuthStore((state) => state.user);

  // Step 2: 기본 정보
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"수컷" | "암컷" | "">("");
  const [breed, setBreed] = useState("");
  const [governmentRegistrationNumber, setGovernmentRegistrationNumber] =
    useState("");

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF9D4D" />
      </View>
    );
  }

  if (!permission.granted && step === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>강아지 등록하기</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.stepIndicator}>
          <View style={styles.stepContainer}>
            <View style={[styles.stepCircle, styles.stepActive]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepLabel}>강아지 사진찍기</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepContainer}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepLabel}>기본 정보</Text>
          </View>
        </View>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>카메라 권한이 필요합니다</Text>
          <Text style={styles.permissionText}>
            강아지 사진 촬영을 위해 카메라 접근 권한이 필요합니다.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>권한 허용</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        setImage(photo.uri);
      }
    } catch (error) {
      Alert.alert("오류", "사진 촬영에 실패했습니다.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!image) {
        Alert.alert("알림", "강아지 사진을 먼저 촬영해주세요.");
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onClose?.();
    } else {
      setStep((step - 1) as Step);
    }
  };


  const handleComplete = async () => {
    if (!user) {
      Alert.alert("오류", "로그인이 필요합니다.");
      return;
    }

    if (!image) {
      Alert.alert("알림", "강아지 사진을 먼저 촬영해주세요.");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. 이미지 업로드
      const uploadResult = await uploadImageToSupabase(image);

      if (!uploadResult) {
        Alert.alert("오류", "이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        setIsProcessing(false);
        return;
      }

      // 2. 이미지 해시 생성
      const imageHash = await generateImageHash(image);

      // 3. pet_id 생성
      const petId = await generateNextPetId();

      // 4. 생년월일 형식 변환 (YYYY.MM.DD -> YYYY-MM-DD)
      const formattedBirthDate = birthDate.replace(/\./g, "-");

      // 5. Pet 생성
      const petData = {
        user_id: user.id,
        pet_id: petId,
        name: name.trim(),
        birth_date: formattedBirthDate,
        gender: gender as "수컷" | "암컷",
        breed: breed.trim() || undefined,
        government_registration_number:
          governmentRegistrationNumber.trim() || undefined,
        status: "등록 완료" as const,
        is_nose_print_verified: true,
      };

      const createdPet = await createPet(petData);

      // 6. NosePrint 생성
      const nosePrintData = {
        pet_id: createdPet.id,
        image_url: uploadResult.url,
        image_hash: imageHash,
        registered_at: new Date().toISOString(),
      };

      await createNosePrint(nosePrintData);

      Alert.alert("등록 완료", "강아지가 성공적으로 등록되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            onSuccess?.();
            onClose?.();
          },
        },
      ]);
    } catch (error: any) {
      console.error("반려견 등록 실패:", error);
      const errorMessage =
        error?.message || "등록에 실패했습니다. 다시 시도해주세요.";
      Alert.alert("오류", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setImage(null);
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        <View style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              step >= 1 && styles.stepActive,
              step === 1 && styles.stepCurrent,
            ]}
          >
            <Text
              style={[styles.stepNumber, step >= 1 && styles.stepNumberActive]}
            >
              1
            </Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              step >= 1 && styles.stepLabelActive,
              step === 1 && styles.stepLabelCurrent,
            ]}
          >
            강아지 사진찍기
          </Text>
        </View>
        <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
        <View style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              step >= 2 && styles.stepActive,
              step === 2 && styles.stepCurrent,
            ]}
          >
            <Text
              style={[styles.stepNumber, step >= 2 && styles.stepNumberActive]}
            >
              2
            </Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              step >= 2 && styles.stepLabelActive,
              step === 2 && styles.stepLabelCurrent,
            ]}
          >
            기본 정보
          </Text>
        </View>
      </View>
    );
  };

  const renderStep1 = () => {
    return (
      <>
        <View
          style={[
            styles.cameraContainer,
            image && styles.cameraContainerWithImage,
          ]}
        >
          {image ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <View style={styles.previewOverlay}>
                <View style={styles.guideCircle} />
              </View>
            </View>
          ) : (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
              mode="picture"
            >
              <View style={styles.overlay}>
                <View style={styles.guideCircle} />
                <Text style={styles.guideText}>
                  강아지의 코를 원 안에 맞춰주세요
                </Text>

                <View style={styles.captureButtonContainer}>
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={takePicture}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <View style={styles.captureButtonInner} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </CameraView>
          )}
        </View>

        {image && (
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={handleNext}
              disabled={isProcessing}
            >
              <Text style={styles.nextButtonText}>다음</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleRetake}
              disabled={isProcessing}
            >
              <Text style={styles.cancelButtonText}>다시 촬영</Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  const renderStep2 = () => {
    return (
      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>
            이름 <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="강아지 이름을 입력하세요"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>
            생년월일 <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY.MM.DD 형식으로 입력하세요"
            value={birthDate}
            onChangeText={setBirthDate}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>
            성별 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "수컷" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("수컷")}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  gender === "수컷" && styles.genderButtonTextActive,
                ]}
              >
                수컷
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "암컷" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("암컷")}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  gender === "암컷" && styles.genderButtonTextActive,
                ]}
              >
                암컷
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>품종</Text>
          <TextInput
            style={styles.input}
            placeholder="품종을 입력하세요 (선택사항)"
            value={breed}
            onChangeText={setBreed}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>정부 동물등록번호</Text>
          <TextInput
            style={styles.input}
            placeholder="15자리 동물등록번호를 입력하세요 (선택사항)"
            value={governmentRegistrationNumber}
            onChangeText={setGovernmentRegistrationNumber}
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={15}
          />
          <Text style={styles.inputHint}>
            예: 410-1234-5678-9012 (하이픈 제외하고 입력)
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={handleBack}
          >
            <ChevronLeft size={20} color="#6B7280" />
            <Text style={styles.backButtonText}>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={handleComplete}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.completeButtonText}>등록 완료</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.closeButton}>
          {step === 1 ? (
            <X size={24} color="#1F2937" />
          ) : (
            <ChevronLeft size={24} color="#1F2937" />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>강아지 등록하기</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6EC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  stepContainer: {
    alignItems: "center",
    minWidth: 80,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  stepActive: {
    backgroundColor: "#FF9D4D",
  },
  stepCurrent: {
    borderWidth: 2,
    borderColor: "#FF9D4D",
    backgroundColor: "#FFFFFF",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
  stepLabelActive: {
    color: "#1F2937",
    fontWeight: "500",
  },
  stepLabelCurrent: {
    color: "#FF9D4D",
    fontWeight: "600",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
    marginBottom: 24,
  },
  stepLineActive: {
    backgroundColor: "#FF9D4D",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: "#FF9D4D",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    marginBottom: 100,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  cameraContainerWithImage: {
    marginBottom: 20,
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "relative",
  },
  guideCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: "#FF9D4D",
    borderStyle: "dashed",
  },
  guideText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 24,
    marginBottom: 40,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  captureButtonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  previewContainer: {
    flex: 1,
    position: "relative",
    width: "100%",
    height: "100%",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  previewOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 90,
    paddingTop: 20,
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#FF9D4D",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#FF9D4D",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF9D4D",
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1F2937",
  },
  inputHint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  genderButtonActive: {
    backgroundColor: "#FF9D4D",
    borderColor: "#FF9D4D",
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  genderButtonTextActive: {
    color: "#FFFFFF",
  },
  optionalSection: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  optionalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  optionalDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flex: 0,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flex: 1,
  },
  skipButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  completeButton: {
    backgroundColor: "#FF9D4D",
    flex: 1,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
