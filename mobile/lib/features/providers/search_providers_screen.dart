import 'package:flutter/material.dart';
import '../../services/provider_coordination_service.dart';
import '../../models/provider_model.dart';
import '../../widgets/provider_card.dart';
import 'provider_details_screen.dart';

class SearchProvidersScreen extends StatefulWidget {
  const SearchProvidersScreen({super.key});

  @override
  State<SearchProvidersScreen> createState() => _SearchProvidersScreenState();
}

class _SearchProvidersScreenState extends State<SearchProvidersScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final ProviderCoordinationService _service = ProviderCoordinationService();

  // Deterministic form
  String _selectedSkill = 'Maintenance';
  String _selectedLocation = 'North Region';
  final _dateController = TextEditingController(text: '2026-10-06');
  List<ServiceProviderModel> _searchResults = [];
  bool _isSearching = false;

  // AI Agent form
  final _requirementController = TextEditingController(
    text: 'Cooling system compressor failure in main warehouse, urgent HVAC repair needed.',
  );
  bool _isAgentRunning = false;
  Map<String, dynamic>? _agentResult;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _runDeterministicSearch();
  }

  Future<void> _runDeterministicSearch() async {
    setState(() => _isSearching = true);
    final results = await _service.searchMatchingProviders(
      skill: _selectedSkill == 'All' ? null : _selectedSkill,
      location: _selectedLocation == 'All' ? null : _selectedLocation,
      availableDate: _dateController.text.trim(),
    );
    if (mounted) {
      setState(() {
        _searchResults = results;
        _isSearching = false;
      });
    }
  }

  Future<void> _runAiAgent() async {
    setState(() => _isAgentRunning = true);
    final result = await _service.runProviderIntelligenceAgent(
      maintenanceRequirement: _requirementController.text.trim(),
      requiredSkill: _selectedSkill == 'All' ? null : _selectedSkill,
      location: _selectedLocation == 'All' ? null : _selectedLocation,
      requiredDate: _dateController.text.trim(),
    );
    if (mounted) {
      setState(() {
        _agentResult = result;
        _isAgentRunning = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Search & Intelligence',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF0F172A)),
        ),
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF1E3A8A),
          unselectedLabelColor: Colors.grey.shade600,
          indicatorColor: const Color(0xFF1E3A8A),
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: const [
            Tab(text: 'Deterministic Rule Match'),
            Tab(text: '🤖 Provider Intelligence AI'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Tab 1: Deterministic Search
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAlignment.start,
                    children: [
                      const Text(
                        'Deterministic Search Criteria',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _selectedSkill,
                        decoration: InputDecoration(
                          labelText: 'Required Skill',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        items: ['All', 'Maintenance', 'Inspection', 'Valuation', 'Legal', 'Logistics', 'Insurance']
                            .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                            .toList(),
                        onChanged: (v) => setState(() => _selectedSkill = v!),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _selectedLocation,
                        decoration: InputDecoration(
                          labelText: 'Region / Location',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        items: ['All', 'North Region', 'South Region', 'East Region', 'West Region', 'Central Region']
                            .map((l) => DropdownMenuItem(value: l, child: Text(l)))
                            .toList(),
                        onChanged: (v) => setState(() => _selectedLocation = v!),
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 44,
                        child: ElevatedButton.icon(
                          onPressed: _isSearching ? null : _runDeterministicSearch,
                          icon: const Icon(Icons.search, size: 18),
                          label: const Text('Run Matching Engine', style: TextStyle(fontWeight: FontWeight.bold)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF1E3A8A),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Matching Results (${_searchResults.length})',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 10),
                _isSearching
                    ? const Center(child: Padding(padding: EdgeInsets.all(24), child: CircularProgressIndicator()))
                    : _searchResults.isEmpty
                        ? const Center(child: Padding(padding: EdgeInsets.all(24), child: Text('No providers match criteria.')))
                        : Column(
                            children: _searchResults.map((prov) {
                              return ProviderCard(
                                provider: prov,
                                onTap: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(builder: (_) => ProviderDetailsScreen(providerId: prov.id)),
                                  );
                                },
                              );
                            }).toList(),
                          ),
              ],
            ),
          ),

          // Tab 2: Provider Intelligence AI Agent
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFBFDBFE)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.auto_awesome, color: Color(0xFF1E3A8A), size: 20),
                          SizedBox(width: 8),
                          Text(
                            'Provider Intelligence Agent',
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Describe the maintenance problem and let the AI agent evaluate candidate suitability & track record.',
                        style: TextStyle(fontSize: 12, color: Color(0xFF334155)),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _requirementController,
                        maxLines: 3,
                        decoration: InputDecoration(
                          hintText: 'Enter maintenance requirement...',
                          backgroundColor: Colors.white,
                          filled: true,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        height: 44,
                        child: ElevatedButton.icon(
                          onPressed: _isAgentRunning ? null : _runAiAgent,
                          icon: _isAgentRunning
                              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : const Icon(Icons.auto_awesome, size: 18),
                          label: Text(_isAgentRunning ? 'Agent Evaluating Tools...' : 'Execute AI Agent', style: const TextStyle(fontWeight: FontWeight.bold)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF2563EB),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                if (_agentResult != null) ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Agent Recommendations',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      Text(
                        'Run ID: ${_agentResult!['agentRunId'] ?? ''}',
                        style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Builder(builder: (ctx) {
                    final recs = _agentResult!['recommendations'] as List? ?? [];
                    if (recs.isEmpty) {
                      return const Card(child: Padding(padding: EdgeInsets.all(16), child: Text('No recommendations generated.')));
                    }
                    return Column(
                      children: recs.map((rec) {
                        final providerId = rec['providerId'] ?? '';
                        final name = rec['providerName'] ?? 'Provider';
                        final score = ((rec['matchScore'] as num?)?.toDouble() ?? 0.8) * 100;
                        final reasons = List<String>.from(rec['reasons'] ?? []);

                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: Color(0xFFBFDBFE))),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(color: const Color(0xFF1E3A8A), borderRadius: BorderRadius.circular(20)),
                                      child: Text('${score.round()}% AI Score', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                ...reasons.map((r) => Padding(
                                      padding: const EdgeInsets.only(bottom: 4),
                                      child: Row(
                                        children: [
                                          const Icon(Icons.check_circle_outline, size: 14, color: Colors.green),
                                          const SizedBox(width: 6),
                                          Expanded(child: Text(r, style: const TextStyle(fontSize: 12, color: Color(0xFF334155)))),
                                        ],
                                      ),
                                    )),
                                const SizedBox(height: 10),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: TextButton.icon(
                                    onPressed: () {
                                      Navigator.of(context).push(
                                        MaterialPageRoute(builder: (_) => ProviderDetailsScreen(providerId: providerId)),
                                      );
                                    },
                                    icon: const Icon(Icons.arrow_forward, size: 16),
                                    label: const Text('View Full Profile'),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    );
                  }),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
