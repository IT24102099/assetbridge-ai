import 'package:flutter/material.dart';
import 'my_assets_screen.dart';
import 'incidents_overview_screen.dart';
import '../services/secure_storage_service.dart';
import '../services/api_client.dart';

class HomeShellScreen extends StatefulWidget {
  const HomeShellScreen({super.key});

  @override
  State<HomeShellScreen> createState() => _HomeShellScreenState();
}

class _HomeShellScreenState extends State<HomeShellScreen> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    MyAssetsScreen(),
    IncidentsOverviewScreen(),
    ApiSettingsTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        indicatorColor: const Color(0xFFDBEAFE),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.apartment_outlined),
            selectedIcon: Icon(Icons.apartment, color: Color(0xFF1E3A8A)),
            label: 'My Assets',
          ),
          NavigationDestination(
            icon: Icon(Icons.warning_amber_outlined),
            selectedIcon: Icon(Icons.warning_amber_rounded, color: Color(0xFF1E3A8A)),
            label: 'Incidents',
          ),
          NavigationDestination(
            icon: Icon(Icons.tune_outlined),
            selectedIcon: Icon(Icons.tune, color: Color(0xFF1E3A8A)),
            label: 'Backend API',
          ),
        ],
      ),
    );
  }
}

class ApiSettingsTab extends StatefulWidget {
  const ApiSettingsTab({super.key});

  @override
  State<ApiSettingsTab> createState() => _ApiSettingsTabState();
}

class _ApiSettingsTabState extends State<ApiSettingsTab> {
  final SecureStorageService _storage = SecureStorageService();
  final ApiClient _api = ApiClient();
  final TextEditingController _urlController = TextEditingController();
  final TextEditingController _tokenController = TextEditingController();
  String _connectionStatus = 'Untested';
  bool _testing = false;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final customUrl = await _storage.read(SecureStorageService.keyApiBaseUrl);
    final token = await _storage.getAuthToken();
    setState(() {
      _urlController.text = customUrl ?? _api.defaultBaseUrl;
      _tokenController.text = token ?? 'eyJh...mock_jwt_token';
    });
  }

  Future<void> _saveSettings() async {
    await _storage.write(SecureStorageService.keyApiBaseUrl, _urlController.text.trim());
    await _storage.saveAuthToken(_tokenController.text.trim());
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('API Configuration saved in Secure Storage')),
      );
    }
  }

  Future<void> _testConnection() async {
    setState(() {
      _testing = true;
      _connectionStatus = 'Testing...';
    });

    try {
      final res = await _api.get('/assets');
      if (res.statusCode == 200) {
        setState(() => _connectionStatus = 'Connected: ASP.NET Core API reachable (200 OK)');
      } else {
        setState(() => _connectionStatus = 'Server replied: HTTP ${res.statusCode}');
      }
    } catch (e) {
      setState(() => _connectionStatus = 'Offline mode: Fallback mock enabled ($e)');
    } finally {
      if (mounted) setState(() => _testing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Backend API & Secure Storage', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'ASP.NET Core Endpoint',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _urlController,
              decoration: const InputDecoration(
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(),
                hintText: 'http://localhost:5148/api',
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'JWT Bearer Token (Secure Storage)',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _tokenController,
              decoration: const InputDecoration(
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: _saveSettings,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E3A8A),
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Save Settings'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed: _testing ? null : _testConnection,
                    child: _testing
                        ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2))
                        : const Text('Test Ping'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: Row(
                children: [
                  const Icon(Icons.cable, size: 20, color: Color(0xFF1E3A8A)),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      _connectionStatus,
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
