import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static final SecureStorageService _instance = SecureStorageService._internal();
  factory SecureStorageService() => _instance;
  SecureStorageService._internal();

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static const String keyAuthToken = 'auth_token';
  static const String keyRepId = 'rep_id';
  static const String keyRepName = 'rep_name';
  static const String keyApiBaseUrl = 'api_base_url';

  Future<void> write(String key, String value) async {
    try {
      await _storage.write(key: key, value: value);
    } catch (_) {}
  }

  Future<String?> read(String key) async {
    try {
      return await _storage.read(key: key);
    } catch (_) {
      return null;
    }
  }

  Future<void> delete(String key) async {
    try {
      await _storage.delete(key: key);
    } catch (_) {}
  }

  Future<String?> getAuthToken() async {
    return await read(keyAuthToken);
  }

  Future<void> setAuthToken(String token) async {
    await write(keyAuthToken, token);
  }

  Future<void> clearAuth() async {
    await delete(keyAuthToken);
    await delete(keyRepId);
    await delete(keyRepName);
  }
}
