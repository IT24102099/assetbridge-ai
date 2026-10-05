import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'secure_storage_service.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();

  final SecureStorageService _secureStorage = SecureStorageService();


  /// Member 2 Express Backend Base URL
  String get defaultBaseUrl {
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:5000/api';
      }
    } catch (_) {}
    return 'http://localhost:5000/api';

  /// Default API endpoint for ASP.NET Core backend
  /// Uses 10.0.2.2 for Android emulator loopback and localhost for iOS/macOS/web
  String get defaultBaseUrl {
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:5148/api';
      }
    } catch (_) {}
    return 'http://localhost:5148/api';

  }

  Future<Map<String, String>> _getHeaders() async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    final token = await _secureStorage.getAuthToken();
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }

    return headers;
  }

  Future<http.Response> get(String endpoint, {Map<String, String>? queryParams}) async {
    final baseUrl = await _secureStorage.read(SecureStorageService.keyApiBaseUrl) ?? defaultBaseUrl;
    var uri = Uri.parse('$baseUrl$endpoint');
    if (queryParams != null && queryParams.isNotEmpty) {
      uri = uri.replace(queryParameters: queryParams);
    }

    final headers = await _getHeaders();

    return await http.get(uri, headers: headers).timeout(const Duration(seconds: 10));

    return await http.get(uri, headers: headers).timeout(const Duration(seconds: 8));

  }

  Future<http.Response> post(String endpoint, {Map<String, dynamic>? body}) async {
    final baseUrl = await _secureStorage.read(SecureStorageService.keyApiBaseUrl) ?? defaultBaseUrl;
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = await _getHeaders();

    return await http
        .post(
          uri,
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        )

        .timeout(const Duration(seconds: 10));
  }

  Future<http.Response> put(String endpoint, {Map<String, dynamic>? body}) async {

        .timeout(const Duration(seconds: 8));
  }

  Future<http.Response> patch(String endpoint, {Map<String, dynamic>? body}) async {

    final baseUrl = await _secureStorage.read(SecureStorageService.keyApiBaseUrl) ?? defaultBaseUrl;
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = await _getHeaders();

    return await http

        .put(

        .patch(

          uri,
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        )

        .timeout(const Duration(seconds: 10));

        .timeout(const Duration(seconds: 8));

  }
}
