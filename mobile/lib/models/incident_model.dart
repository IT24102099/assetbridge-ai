enum IncidentSeverity { low, medium, high, critical }

enum IncidentStatus {
  reported,
  underReview,
  inProgress,
  resolved,
  closed,
}

class IncidentModel {
  final int id;
  final int assetId;
  final String? assetCode;
  final String? assetName;
  final String? assetLocation;
  final String title;
  final String description;
  final IncidentSeverity severity;
  final IncidentStatus status;
  final double? budget;
  final DateTime? preferredDate;
  final String? photoUrl;
  final DateTime createdAt;

  IncidentModel({
    required this.id,
    required this.assetId,
    this.assetCode,
    this.assetName,
    this.assetLocation,
    required this.title,
    required this.description,
    required this.severity,
    required this.status,
    this.budget,
    this.preferredDate,
    this.photoUrl,
    required this.createdAt,
  });

  factory IncidentModel.fromJson(Map<String, dynamic> json) {
    return IncidentModel(
      id: json['id'] as int? ?? 0,
      assetId: json['assetId'] as int? ?? 0,
      assetCode: json['assetCode'] as String?,
      assetName: json['assetName'] as String?,
      assetLocation: json['assetLocation'] as String?,
      title: json['title'] as String? ?? 'Untitled Incident',
      description: json['description'] as String? ?? '',
      severity: _parseSeverity(json['severity']),
      status: _parseStatus(json['status']),
      budget: (json['budget'] as num?)?.toDouble(),
      preferredDate: json['preferredDate'] != null
          ? DateTime.tryParse(json['preferredDate'] as String)
          : null,
      photoUrl: json['photoUrl'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  static IncidentSeverity _parseSeverity(dynamic raw) {
    if (raw == null) return IncidentSeverity.medium;
    final str = raw.toString().toLowerCase();
    if (str.contains('crit')) return IncidentSeverity.critical;
    if (str.contains('high')) return IncidentSeverity.high;
    if (str.contains('low')) return IncidentSeverity.low;
    return IncidentSeverity.medium;
  }

  static IncidentStatus _parseStatus(dynamic raw) {
    if (raw == null) return IncidentStatus.reported;
    final str = raw.toString().toLowerCase();
    if (str.contains('closed')) return IncidentStatus.closed;
    if (str.contains('resolve')) return IncidentStatus.resolved;
    if (str.contains('progress')) return IncidentStatus.inProgress;
    if (str.contains('review')) return IncidentStatus.underReview;
    return IncidentStatus.reported;
  }
}
