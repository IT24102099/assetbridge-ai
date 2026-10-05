import 'dart:convert';
import '../models/asset_model.dart';
import '../models/incident_model.dart';
import 'api_client.dart';

class IncidentService {
  static final IncidentService _instance = IncidentService._internal();
  factory IncidentService() => _instance;
  IncidentService._internal();

  final ApiClient _api = ApiClient();

  // Mock data fallback if backend is unreachable
  final List<AssetModel> _mockAssets = [
    AssetModel(
      id: 1,
      assetCode: 'AST-CMB-001',
      name: 'Colombo Central Water Pump #4',
      category: 'Water & Sanitation',
      location: 'Maligawatta Pumping Station, Colombo 10',
      address: 'No 45, Sri Sangaraja Mawatha, Colombo',
      coordinates: '6.9319° N, 79.8656° E',
      status: AssetStatus.active,
      ownerId: 'USR-LK-902',
      createdAt: DateTime.now().subtract(const Duration(days: 45)),
      activeIncidentsCount: 0,
    ),
    AssetModel(
      id: 2,
      assetCode: 'AST-KND-002',
      name: 'Kandy General Hospital Backup Generator',
      category: 'Power & Energy',
      location: 'Main Power House, Kandy Teaching Hospital',
      address: 'Hospital Square, Kandy',
      coordinates: '7.2906° N, 80.6337° E',
      status: AssetStatus.maintenance,
      ownerId: 'USR-LK-902',
      createdAt: DateTime.now().subtract(const Duration(days: 60)),
      activeIncidentsCount: 1,
    ),
    AssetModel(
      id: 3,
      assetCode: 'AST-JFN-003',
      name: 'Jaffna Agro Solar Grid Inverter Unit',
      category: 'Renewable Energy',
      location: 'Thirunelvely Agri-Research Zone, Jaffna',
      address: 'Palali Road, Thirunelvely, Jaffna',
      coordinates: '9.6849° N, 80.0210° E',
      status: AssetStatus.active,
      ownerId: 'USR-LK-902',
      createdAt: DateTime.now().subtract(const Duration(days: 90)),
      activeIncidentsCount: 0,
    ),
    AssetModel(
      id: 4,
      assetCode: 'AST-GLE-004',
      name: 'Galle Fort Coastal Drainage Gate #2',
      category: 'Flood Control',
      location: 'Rampart Street Gate, Galle Fort',
      address: 'Old Dutch Ramparts, Galle',
      coordinates: '6.0329° N, 80.2168° E',
      status: AssetStatus.active,
      ownerId: 'USR-LK-902',
      createdAt: DateTime.now().subtract(const Duration(days: 120)),
      activeIncidentsCount: 0,
    ),
  ];

  final List<IncidentModel> _mockIncidents = [
    IncidentModel(
      id: 1001,
      assetId: 2,
      assetCode: 'AST-KND-002',
      assetName: 'Kandy General Hospital Backup Generator',
      assetLocation: 'Main Power House, Kandy Teaching Hospital',
      title: 'Coolant Gasket Leak & Sensor Overheating',
      description:
        'Engine coolant temperature exceeded 95°C during the weekly generator load test. Suspected radiator gasket failure or radiator hose puncture requiring immediate emergency repair before hospital power maintenance.',
      severity: IncidentSeverity.high,
      status: IncidentStatus.inProgress,
      budget: 85000,
      preferredDate: DateTime.now().add(const Duration(days: 2)),
      photoUrl:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
    ),
    IncidentModel(
      id: 1002,
      assetId: 1,
      assetCode: 'AST-CMB-001',
      assetName: 'Colombo Central Water Pump #4',
      assetLocation: 'Maligawatta Pumping Station, Colombo 10',
      title: 'Low Pressure Cavitation Noise',
      description:
        'Pressure gauge indicates 2.4 bar instead of 4.5 bar standard operating threshold. Rattling noise observed in suction pipeline.',
      severity: IncidentSeverity.medium,
      status: IncidentStatus.underReview,
      budget: 45000,
      preferredDate: DateTime.now().add(const Duration(days: 4)),
      photoUrl:
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
  ];

  Future<List<AssetModel>> getMyAssets() async {
    try {
      final res = await _api.get('/assets');
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        return data.map((json) => AssetModel.fromJson(json)).toList();
      }
    } catch (_) {}
    return List.from(_mockAssets);
  }

  Future<List<IncidentModel>> getIncidents() async {
    try {
      final res = await _api.get('/incidents');
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        return data.map((json) => IncidentModel.fromJson(json)).toList();
      }
    } catch (_) {}
    return List.from(_mockIncidents);
  }

  Future<IncidentModel?> getIncidentById(int id) async {
    try {
      final res = await _api.get('/incidents/$id');
      if (res.statusCode == 200) {
        return IncidentModel.fromJson(jsonDecode(res.body));
      }
    } catch (_) {}
    try {
      return _mockIncidents.firstWhere((i) => i.id == id);
    } catch (_) {
      return null;
    }
  }

  Future<IncidentModel> reportIncident({
    required int assetId,
    required String title,
    required String description,
    required IncidentSeverity severity,
    double? budget,
    DateTime? preferredDate,
    String? photoUrl,
  }) async {
    final payload = {
      'assetId': assetId,
      'title': title,
      'description': description,
      'severity': severity.name.toUpperCase(),
      'budget': budget,
      'preferredDate': preferredDate?.toIso8601String(),
      'photoUrl': photoUrl,
      'reportedBy': 'Mobile App User',
    };

    try {
      final res = await _api.post('/incidents', body: payload);
      if (res.statusCode == 201 || res.statusCode == 200) {
        return IncidentModel.fromJson(jsonDecode(res.body));
      }
    } catch (_) {}

    // Mock fallback creation
    final asset = _mockAssets.firstWhere(
      (a) => a.id == assetId,
      orElse: () => _mockAssets.first,
    );

    final newIncident = IncidentModel(
      id: DateTime.now().millisecondsSinceEpoch % 10000,
      assetId: assetId,
      assetCode: asset.assetCode,
      assetName: asset.name,
      assetLocation: asset.location,
      title: title,
      description: description,
      severity: severity,
      status: IncidentStatus.reported,
      budget: budget,
      preferredDate: preferredDate,
      photoUrl: photoUrl,
      createdAt: DateTime.now(),
    );

    _mockIncidents.insert(0, newIncident);
    return newIncident;
  }

  Future<bool> updateIncidentStatus(int id, IncidentStatus status, {String? notes}) async {
    final payload = {
      'status': status.name.toUpperCase(),
      'notes': notes ?? 'Status updated from mobile app',
      'updatedBy': 'Mobile App User',
    };

    try {
      final res = await _api.patch('/incidents/$id/status', body: payload);
      if (res.statusCode == 200) return true;
    } catch (_) {}

    // Local fallback update
    final index = _mockIncidents.indexWhere((i) => i.id == id);
    if (index != -1) {
      final old = _mockIncidents[index];
      _mockIncidents[index] = IncidentModel(
        id: old.id,
        assetId: old.assetId,
        assetCode: old.assetCode,
        assetName: old.assetName,
        assetLocation: old.assetLocation,
        title: old.title,
        description: old.description,
        severity: old.severity,
        status: status,
        budget: old.budget,
        preferredDate: old.preferredDate,
        photoUrl: old.photoUrl,
        createdAt: old.createdAt,
      );
      return true;
    }
    return false;
  }
}
