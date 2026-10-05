import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static final SecureStorageService _instance = SecureStorageService._internal();
  factory SecureStorageService() => _instance;
  SecureStorageService._internal();

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  // In-memory fallback if native storage is unavailable in test environments
  final Map<String, String> _memoryFallback = {};

  static const String keyAuthToken = 'assetbridge_auth_token';
  static const String keyRefreshToken = 'assetbridge_refresh_token';
  static const String keyUserId = 'assetbridge_user_id';
  static const String keyApiBaseUrl = 'assetbridge_api_base_url';

  Future<void> write(String key, String value) async {
    _memoryFallback[key] = value;
    try {
      await _storage.write(key: key, value: value);
    } catch (_) {
      // Fallback in memory
    }
  }

  Future<String?> read(String key) async {
    try {
      final value = await _storage.read(key: key);
      if (value != null) return value;
    } catch (_) {
      // Fallback
    }
    return _memoryFallback[key];
  }

  Future<void> delete(String key) async {
    _memoryFallback.remove(key);
    try {
      await _storage.delete(key: key);
    } catch (_) {
      // Fallback
    }
  }

  Future<void> saveAuthToken(String token) async {
    await write(keyAuthToken, token);
  }

  Future<String?> getAuthToken() async {
    return await read(keyAuthToken);
  }

  Future<void> clearAuth() async {
    await delete(keyAuthToken);
    await delete(keyRefreshToken);
    await delete(keyUserId);
  }
}
