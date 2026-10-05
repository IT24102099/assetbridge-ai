enum AssetStatus { active, maintenance, decommissioned }

class AssetModel {
  final int id;
  final String assetCode;
  final String name;
  final String category;
  final String location;
  final String? address;
  final String? coordinates;
  final AssetStatus status;
  final String? ownerId;
  final DateTime createdAt;
  final int activeIncidentsCount;

  AssetModel({
    required this.id,
    required this.assetCode,
    required this.name,
    required this.category,
    required this.location,
    this.address,
    this.coordinates,
    required this.status,
    this.ownerId,
    required this.createdAt,
    this.activeIncidentsCount = 0,
  });

  factory AssetModel.fromJson(Map<String, dynamic> json) {
    return AssetModel(
      id: json['id'] as int? ?? 0,
      assetCode: json['assetCode'] as String? ?? '',
      name: json['name'] as String? ?? '',
      category: json['category'] as String? ?? 'General',
      location: json['location'] as String? ?? '',
      address: json['address'] as String?,
      coordinates: json['coordinates'] as String?,
      status: _parseStatus(json['status']),
      ownerId: json['ownerId'] as String?,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String) ?? DateTime.now()
          : DateTime.now(),
      activeIncidentsCount: json['activeIncidentsCount'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'assetCode': assetCode,
      'name': name,
      'category': category,
      'location': location,
      'address': address,
      'coordinates': coordinates,
      'status': status.name,
      'ownerId': ownerId,
      'createdAt': createdAt.toIso8601String(),
      'activeIncidentsCount': activeIncidentsCount,
    };
  }

  static AssetStatus _parseStatus(dynamic raw) {
    if (raw == null) return AssetStatus.active;
    final str = raw.toString().toLowerCase();
    if (str.contains('maintenance')) return AssetStatus.maintenance;
    if (str.contains('decommission')) return AssetStatus.decommissioned;
    return AssetStatus.active;
  }
}
