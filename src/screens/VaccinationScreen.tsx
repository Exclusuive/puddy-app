import { useState } from "react";
import { Alert } from "react-native";
import RecordListScreen, { RecordItem } from "../components/RecordListScreen";
import RecordDetailScreen from "../components/RecordDetailScreen";

// 예방접종 예시 데이터
const sampleVaccinations: RecordItem[] = [
  {
    id: "1",
    title: "종합백신 (DHPPL)",
    subtitle: "서울동물병원",
    date: "2024.01.15",
    vaccineType: "종합백신 (DHPPL)",
    vaccinationDate: "2024.01.15",
    nextDueDate: "2024.07.15",
    veterinarianName: "김수의",
    clinicName: "서울동물병원",
    notes: "정상 접종 완료",
  },
  {
    id: "2",
    title: "코로나바이러스",
    subtitle: "서울동물병원",
    date: "2024.01.15",
    vaccineType: "코로나바이러스",
    vaccinationDate: "2024.01.15",
    nextDueDate: "2024.07.15",
    veterinarianName: "김수의",
    clinicName: "서울동물병원",
    notes: "정상 접종 완료",
  },
  {
    id: "3",
    title: "켄넬코프",
    subtitle: "서울동물병원",
    date: "2024.01.15",
    vaccineType: "켄넬코프",
    vaccinationDate: "2024.01.15",
    nextDueDate: "2024.07.15",
    veterinarianName: "김수의",
    clinicName: "서울동물병원",
    notes: "정상 접종 완료",
  },
  {
    id: "4",
    title: "광견병",
    subtitle: "강남동물병원",
    date: "2023.12.10",
    vaccineType: "광견병",
    vaccinationDate: "2023.12.10",
    nextDueDate: "2024.12.10",
    veterinarianName: "이동물",
    clinicName: "강남동물병원",
    notes: "1년 주기 접종",
  },
];

type ScreenState = "list" | "detail";

interface VaccinationScreenProps {
  onBack: () => void;
}

export default function VaccinationScreen({ onBack }: VaccinationScreenProps) {
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
    Alert.alert("예방접종 추가", "새로운 예방접종 기록을 추가하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "추가하기",
        onPress: () => {
          // TODO: 실제 추가 화면으로 이동
          Alert.alert("추가", "예방접종 기록 추가 화면으로 이동합니다.");
        },
      },
    ]);
  };

  if (screenState === "detail" && selectedRecord) {
    const fields = [
      { label: "백신 종류", value: selectedRecord.vaccineType },
      { label: "접종일", value: selectedRecord.vaccinationDate },
      { label: "다음 접종 예정일", value: selectedRecord.nextDueDate },
      { label: "수의사", value: selectedRecord.veterinarianName },
      { label: "동물병원", value: selectedRecord.clinicName },
      { label: "메모", value: selectedRecord.notes || "-" },
    ];

    return (
      <RecordDetailScreen
        title="예방접종 상세"
        fields={fields}
        onBack={handleBack}
      />
    );
  }

  return (
    <RecordListScreen
      title="예방접종 기록"
      records={sampleVaccinations}
      onRecordPress={handleRecordPress}
      onBack={handleBack}
      onAddPress={handleAddPress}
    />
  );
}
