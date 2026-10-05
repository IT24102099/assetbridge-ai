class AvailabilitySlotModel {
  final String id;
  final String providerId;
  final String date;
  final String status;
  final String startTime;
  final String endTime;
  final String notes;

  AvailabilitySlotModel({
    required this.id,
    required this.providerId,
    required this.date,
    required this.status,
    required this.startTime,
    required this.endTime,
    required this.notes,
  });

  factory AvailabilitySlotModel.fromJson(Map<String, dynamic> json) {
    return AvailabilitySlotModel(
      id: json['id'] ?? '',
      providerId: json['providerId'] ?? '',
      date: json['date'] ?? '',
      status: json['status'] ?? 'AVAILABLE',
      startTime: json['startTime'] ?? '09:00',
      endTime: json['endTime'] ?? '17:00',
      notes: json['notes'] ?? '',
    );
  }
}
