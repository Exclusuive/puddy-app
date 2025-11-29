import { useState } from "react";
import { Alert } from "react-native";
import RecordListScreen, { RecordItem } from "../components/RecordListScreen";
import RecordDetailScreen from "../components/RecordDetailScreen";

// 진료기록 예시 데이터
const sampleMedicalRecords: RecordItem[] = [
  {
    id: "1",
    title: "정기 건강검진",
    subtitle: "서울동물병원",
    date: "2024.01.20",
    clinicName: "서울동물병원",
    veterinarianName: "김수의",
    visitDate: "2024.01.20",
    diagnosis: "정상",
    treatment: "혈액검사, X-ray 촬영, 신체검사",
    prescription: "없음",
    cost: "150,000원",
    notes: "전반적으로 건강 상태 양호",
  },
  {
    id: "2",
    title: "피부염 치료",
    subtitle: "강남동물병원",
    date: "2023.12.15",
    clinicName: "강남동물병원",
    veterinarianName: "이동물",
    visitDate: "2023.12.15",
    diagnosis: "알레르기성 피부염",
    treatment: "항히스타민 주사, 연고 처방",
    prescription: "항히스타민제, 항생제 연고",
    cost: "80,000원",
    notes: "2주 후 재방문 필요",
  },
  {
    id: "3",
    title: "구강 검진",
    subtitle: "서울동물병원",
    date: "2023.11.10",
    clinicName: "서울동물병원",
    veterinarianName: "김수의",
    visitDate: "2023.11.10",
    diagnosis: "치석 제거 필요",
    treatment: "스케일링 시술",
    prescription: "구강 청결제",
    cost: "200,000원",
    notes: "정기적인 구강 관리 필요",
  },
];

type ScreenState = "list" | "detail";

interface MedicalRecordScreenProps {
  onBack: () => void;
}

export default function MedicalRecordScreen({
  onBack,
}: MedicalRecordScreenProps) {
  const [screenState, setScreenState] = useState<ScreenState>("list");
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);

  const handleRecordPress = (record: RecordItem) => {
    setSelectedRecord(record);
    setScreenState("detail");
  };

  const handleBackToList = () => {
    setScreenState("list");
    setSelectedRecord(null);
  };

  const handleBack = () => {
    if (screenState === "detail") {
      handleBackToList();
    } else {
      onBack();
    }
  };

  const handleAddPress = () => {
    Alert.alert("진료기록 추가", "새로운 진료 기록을 추가하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "추가하기",
        onPress: () => {
          // TODO: 실제 추가 화면으로 이동
          Alert.alert("추가", "진료 기록 추가 화면으로 이동합니다.");
        },
      },
    ]);
  };

  if (screenState === "detail" && selectedRecord) {
    const fields = [
      { label: "방문일", value: selectedRecord.visitDate },
      { label: "동물병원", value: selectedRecord.clinicName },
      { label: "수의사", value: selectedRecord.veterinarianName },
      { label: "진단명", value: selectedRecord.diagnosis },
      { label: "치료 내용", value: selectedRecord.treatment },
      { label: "처방전", value: selectedRecord.prescription },
      { label: "비용", value: selectedRecord.cost },
      { label: "메모", value: selectedRecord.notes || "-" },
    ];

    return (
      <RecordDetailScreen
        title="진료 기록 상세"
        fields={fields}
        onBack={handleBack}
      />
    );
  }

  return (
    <RecordListScreen
      title="진료 기록"
      records={sampleMedicalRecords}
      onRecordPress={handleRecordPress}
      onBack={handleBack}
      onAddPress={handleAddPress}
    />
  );
}
