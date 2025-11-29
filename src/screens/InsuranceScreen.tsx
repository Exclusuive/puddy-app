import { useState } from "react";
import { Alert } from "react-native";
import RecordListScreen, { RecordItem } from "../components/RecordListScreen";
import RecordDetailScreen from "../components/RecordDetailScreen";

// 보험정보 예시 데이터
const sampleInsuranceRecords: RecordItem[] = [
  {
    id: "1",
    title: "펫보험 플랜 A",
    subtitle: "삼성화재",
    date: "2024.01.01 ~ 2024.12.31",
    insuranceCompany: "삼성화재",
    insuranceNumber: "PET-2024-001234",
    planName: "펫보험 플랜 A",
    startDate: "2024.01.01",
    endDate: "2024.12.31",
    coverage: "의료비 80% 보장 (연간 최대 500만원)",
    premium: "월 30,000원",
    notes: "정기 납부 중",
  },
  {
    id: "2",
    title: "청구 내역 - 피부염 치료",
    subtitle: "삼성화재",
    date: "2023.12.20",
    insuranceCompany: "삼성화재",
    insuranceNumber: "PET-2024-001234",
    claimDate: "2023.12.20",
    claimType: "의료비 청구",
    treatment: "피부염 치료",
    claimAmount: "64,000원",
    approvedAmount: "64,000원",
    status: "승인 완료",
    notes: "처리 완료",
  },
  {
    id: "3",
    title: "청구 내역 - 정기 건강검진",
    subtitle: "삼성화재",
    date: "2024.01.25",
    insuranceCompany: "삼성화재",
    insuranceNumber: "PET-2024-001234",
    claimDate: "2024.01.25",
    claimType: "의료비 청구",
    treatment: "정기 건강검진",
    claimAmount: "120,000원",
    approvedAmount: "120,000원",
    status: "승인 완료",
    notes: "처리 완료",
  },
];

type ScreenState = "list" | "detail";

interface InsuranceScreenProps {
  onBack: () => void;
}

export default function InsuranceScreen({ onBack }: InsuranceScreenProps) {
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
    Alert.alert(
      "보험정보 추가",
      "새로운 보험 정보 또는 청구 내역을 추가하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "추가하기",
          onPress: () => {
            // TODO: 실제 추가 화면으로 이동
            Alert.alert("추가", "보험정보 추가 화면으로 이동합니다.");
          },
        },
      ]
    );
  };

  if (screenState === "detail" && selectedRecord) {
    // 보험 정보인지 청구 내역인지 구분
    const isClaim = selectedRecord.claimType !== undefined;

    const fields = isClaim
      ? [
          { label: "청구일", value: selectedRecord.claimDate },
          { label: "보험사", value: selectedRecord.insuranceCompany },
          { label: "보험 번호", value: selectedRecord.insuranceNumber },
          { label: "청구 유형", value: selectedRecord.claimType },
          { label: "치료 내용", value: selectedRecord.treatment },
          { label: "청구 금액", value: selectedRecord.claimAmount },
          { label: "승인 금액", value: selectedRecord.approvedAmount },
          { label: "상태", value: selectedRecord.status },
          { label: "메모", value: selectedRecord.notes || "-" },
        ]
      : [
          { label: "보험사", value: selectedRecord.insuranceCompany },
          { label: "보험 번호", value: selectedRecord.insuranceNumber },
          { label: "플랜명", value: selectedRecord.planName },
          {
            label: "보험 기간",
            value: `${selectedRecord.startDate} ~ ${selectedRecord.endDate}`,
          },
          { label: "보장 내용", value: selectedRecord.coverage },
          { label: "보험료", value: selectedRecord.premium },
          { label: "메모", value: selectedRecord.notes || "-" },
        ];

    return (
      <RecordDetailScreen
        title={isClaim ? "청구 내역 상세" : "보험 정보 상세"}
        fields={fields}
        onBack={handleBack}
      />
    );
  }

  return (
    <RecordListScreen
      title="보험정보"
      records={sampleInsuranceRecords}
      onRecordPress={handleRecordPress}
      onBack={handleBack}
      onAddPress={handleAddPress}
    />
  );
}
