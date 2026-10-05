class VisitTaskModel {
  final String id;
  final String title;
  final String assetCode;
  final String providerName;
  final String location;
  final String date;
  final String time;
  String status; // 'Active', 'In Progress', 'Completed', 'Pending'
  String notes;
  List<String> photoUrls;

  VisitTaskModel({
    required this.id,
    required this.title,
    required this.assetCode,
    required this.providerName,
    required this.location,
    required this.date,
    required this.time,
    required this.status,
    this.notes = '',
    this.photoUrls = const [],
  });
}
