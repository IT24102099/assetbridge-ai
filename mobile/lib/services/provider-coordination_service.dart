import 'dart:convert';
import 'api_client.dart';
import '../models/representative_model.dart';
import '../models/provider_model.dart';
import '../models/availability_model.dart';

class ProviderCoordinationService {
  final ApiClient _apiClient = ApiClient();

  Future<List<RepresentativeModel>> getRepresentatives() async {
    try {
      final response = await _apiClient.get('/representatives');
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['success'] == true && json['data'] is List) {
          return (json['data'] as List)
              .map((item) => RepresentativeModel.fromJson(item))
              .toList();
        }
      }
    } catch (_) {}
    return [];
  }

  Future<List<ServiceProviderModel>> getProviders({String? skill, String? location}) async {
    try {
      final queryParams = <String, String>{};
      if (skill != null && skill.isNotEmpty) queryParams['skill'] = skill;
      if (location != null && location.isNotEmpty) queryParams['location'] = location;

      final response = await _apiClient.get('/providers', queryParams: queryParams);
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['success'] == true && json['data'] is List) {
          return (json['data'] as List)
              .map((item) => ServiceProviderModel.fromJson(item))
              .toList();
        }
      }
    } catch (_) {}
    return [];
  }

  Future<ServiceProviderModel?> getProviderById(String id) async {
    try {
      final response = await _apiClient.get('/providers/$id');
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['success'] == true && json['data'] != null) {
          return ServiceProviderModel.fromJson(json['data']);
        }
      }
    } catch (_) {}
    return null;
  }

  Future<List<ServiceProviderModel>> searchMatchingProviders({
    String? skill,
    String? location,
    String? availableDate,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (skill != null && skill.isNotEmpty) queryParams['skill'] = skill;
      if (location != null && location.isNotEmpty) queryParams['location'] = location;
      if (availableDate != null && availableDate.isNotEmpty) queryParams['availableDate'] = availableDate;

      final response = await _apiClient.get('/providers/search', queryParams: queryParams);
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['success'] == true && json['data'] is List) {
          return (json['data'] as List)
              .map((item) => ServiceProviderModel.fromJson(item))
              .toList();
        }
      }
    } catch (_) {}
    return [];
  }

  Future<Map<String, dynamic>?> runProviderIntelligenceAgent({
    required String maintenanceRequirement,
    String? requiredSkill,
    String? location,
    String? requiredDate,
  }) async {
    try {
      final body = <String, dynamic>{
        'maintenanceRequirement': maintenanceRequirement,
        if (requiredSkill != null && requiredSkill.isNotEmpty) 'requiredSkill': requiredSkill,
        if (location != null && location.isNotEmpty) 'location': location,
        if (requiredDate != null && requiredDate.isNotEmpty) 'requiredDate': requiredDate,
      };

      final response = await _apiClient.post('/agents/provider-intelligence/recommend', body: body);
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['success'] == true && json['data'] != null) {
          return json['data'];
        }
      }
    } catch (_) {}
    return null;
  }

  Future<List<AvailabilitySlotModel>> getProviderAvailability(String providerId) async {
    try {
      final response = await _apiClient.get('/providers/$providerId/availability');
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['success'] == true && json['data'] is List) {
          return (json['data'] as List)
              .map((item) => AvailabilitySlotModel.fromJson(item))
              .toList();
        }
      }
    } catch (_) {}
    return [];
  }
}
