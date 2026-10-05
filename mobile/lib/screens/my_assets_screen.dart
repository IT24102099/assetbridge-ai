import 'package:flutter/material.dart';
import '../models/asset_model.dart';
import '../services/incident_service.dart';
import '../widgets/asset_card.dart';
import 'report_incident_screen.dart';

class MyAssetsScreen extends StatefulWidget {
  const MyAssetsScreen({super.key});

  @override
  State<MyAssetsScreen> createState() => _MyAssetsScreenState();
}

class _MyAssetsScreenState extends State<MyAssetsScreen> {
  final IncidentService _incidentService = IncidentService();
  List<AssetModel> _assets = [];
  bool _loading = true;
  String _search = '';
  AssetStatus? _selectedStatus;
  bool _isGrid = false;

  @override
  void initState() {
    super.initState();
    _loadAssets();
  }

  Future<void> _loadAssets() async {
    setState(() => _loading = true);
    final assets = await _incidentService.getMyAssets();
    if (mounted) {
      setState(() {
        _assets = assets;
        _loading = false;
      });
    }
  }

  List<AssetModel> get _filteredAssets {
    return _assets.filter((asset) {
      final matchSearch = _search.isEmpty ||
          asset.name.toLowerCase().contains(_search.toLowerCase()) ||
          asset.assetCode.toLowerCase().contains(_search.toLowerCase()) ||
          asset.location.toLowerCase().contains(_search.toLowerCase()) ||
          asset.category.toLowerCase().contains(_search.toLowerCase());

      final matchStatus = _selectedStatus == null || asset.status == _selectedStatus;

      return matchSearch && matchStatus;
    }).toList();
  }

  void _openReportIncident([AssetModel? preselectedAsset]) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ReportIncidentScreen(
          preselectedAssetId: preselectedAsset?.id,
          preselectedAssetName: preselectedAsset?.name,
        ),
      ),
    );

    if (result == true) {
      _loadAssets();
    }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredAssets;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              'My Infrastructure Assets',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              'Overseas Asset Ownership Registry',
              style: TextStyle(fontSize: 11, color: Colors.white70),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            tooltip: _isGrid ? 'Switch to List' : 'Switch to Grid',
            icon: Icon(_isGrid ? Icons.view_list : Icons.grid_view),
            onPressed: () => setState(() => _isGrid = !_isGrid),
          ),
          IconButton(
            tooltip: 'Refresh',
            icon: const Icon(Icons.refresh),
            onPressed: _loadAssets,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter Header Container
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
            child: Column(
              children: [
                // Search Input
                TextField(
                  onChanged: (val) => setState(() => _search = val),
                  decoration: InputDecoration(
                    hintText: 'Search asset name, code, or city...',
                    hintStyle: TextStyle(fontSize: 13, color: Colors.grey.shade400),
                    prefixIcon: const Icon(Icons.search, size: 20),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                    filled: true,
                    fillColor: const Color(0xFFF1F5F9),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Status Chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      FilterChip(
                        label: const Text('All Assets', style: TextStyle(fontSize: 11)),
                        selected: _selectedStatus == null,
                        onSelected: (_) => setState(() => _selectedStatus = null),
                        selectedColor: const Color(0xFFDBEAFE),
                        checkmarkColor: const Color(0xFF1E3A8A),
                      ),
                      const SizedBox(width: 8),
                      FilterChip(
                        label: const Text('Active', style: TextStyle(fontSize: 11)),
                        selected: _selectedStatus == AssetStatus.active,
                        onSelected: (_) => setState(() => _selectedStatus = AssetStatus.active),
                        selectedColor: const Color(0xFFDCFCE7),
                        checkmarkColor: const Color(0xFF15803D),
                      ),
                      const SizedBox(width: 8),
                      FilterChip(
                        label: const Text('Under Maintenance', style: TextStyle(fontSize: 11)),
                        selected: _selectedStatus == AssetStatus.maintenance,
                        onSelected: (_) => setState(() => _selectedStatus = AssetStatus.maintenance),
                        selectedColor: const Color(0xFFFEF3C7),
                        checkmarkColor: const Color(0xFFB45309),
                      ),
                      const SizedBox(width: 8),
                      FilterChip(
                        label: const Text('Decommissioned', style: TextStyle(fontSize: 11)),
                        selected: _selectedStatus == AssetStatus.decommissioned,
                        onSelected: (_) => setState(() => _selectedStatus = AssetStatus.decommissioned),
                        selectedColor: const Color(0xFFFEE2E2),
                        checkmarkColor: const Color(0xFFB91C1C),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Assets Count Summary
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${filtered.length} Properties / Assets found',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade700,
                  ),
                ),
                if (_loading)
                  const SizedBox(
                    width: 14,
                    height: 14,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
              ],
            ),
          ),

          // Main List or Grid
          Expanded(
            child: _loading && _assets.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : filtered.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.inventory_2_outlined, size: 48, color: Colors.grey.shade400),
                            const SizedBox(height: 12),
                            Text(
                              'No matching assets found',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.grey.shade700,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Try resetting search queries or status filters',
                              style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadAssets,
                        child: _isGrid
                            ? GridView.builder(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 2,
                                  childAspectRatio: 0.85,
                                  crossAxisSpacing: 12,
                                  mainAxisSpacing: 12,
                                ),
                                itemCount: filtered.length,
                                itemBuilder: (context, index) {
                                  final asset = filtered[index];
                                  return _buildGridCard(asset);
                                },
                              )
                            : ListView.builder(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                itemCount: filtered.length,
                                itemBuilder: (context, index) {
                                  final asset = filtered[index];
                                  return AssetCard(
                                    asset: asset,
                                    onReportIncident: () => _openReportIncident(asset),
                                    onTap: () => _showAssetDetailsBottomSheet(asset),
                                  );
                                },
                              ),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openReportIncident(),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_alert_rounded),
        label: const Text('Report Defect', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildGridCard(AssetModel asset) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              asset.assetCode,
              style: const TextStyle(
                fontFamily: 'monospace',
                fontSize: 10,
                color: Color(0xFF2563EB),
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              asset.name,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
            ),
            const Spacer(),
            Text(
              asset.category,
              style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: asset.status == AssetStatus.active
                        ? Colors.emerald
                        : (asset.status == AssetStatus.maintenance ? Colors.amber : Colors.red),
                    shape: BoxShape.circle,
                  ),
                ),
                Text(
                  asset.status.name.toUpperCase(),
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showAssetDetailsBottomSheet(AssetModel asset) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  asset.assetCode,
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2563EB),
                  ),
                ),
                Text(
                  asset.status.name.toUpperCase(),
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              asset.name,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            Text('Category: ${asset.category}'),
            Text('Location: ${asset.location}'),
            if (asset.address != null) Text('Address: ${asset.address}'),
            if (asset.coordinates != null) Text('Coordinates: ${asset.coordinates}'),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E3A8A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                icon: const Icon(Icons.add_alert_rounded),
                label: const Text('Report Defect for this Asset'),
                onPressed: () {
                  Navigator.pop(ctx);
                  _openReportIncident(asset);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
extension ListFilter<T> on List<T> {
  List<T> filter(bool Function(T) test) {
    return where(test).toList();
  }
}
