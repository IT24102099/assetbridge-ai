import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/incident_model.dart';
import '../services/incident_service.dart';
import '../widgets/status_chip.dart';
import 'incident_tracking_screen.dart';
import 'report_incident_screen.dart';

class IncidentsOverviewScreen extends StatefulWidget {
  const IncidentsOverviewScreen({super.key});

  @override
  State<IncidentsOverviewScreen> createState() => _IncidentsOverviewScreenState();
}

class _IncidentsOverviewScreenState extends State<IncidentsOverviewScreen> {
  final IncidentService _incidentService = IncidentService();
  List<IncidentModel> _incidents = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadIncidents();
  }

  Future<void> _loadIncidents() async {
    setState(() => _loading = true);
    final data = await _incidentService.getIncidents();
    if (mounted) {
      setState(() {
        _incidents = data;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Incident Tracking & Triage', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadIncidents,
          ),
        ],
      ),
      body: _loading && _incidents.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadIncidents,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _incidents.length,
                itemBuilder: (context, index) {
                  final incident = _incidents[index];
                  return Card(
                    elevation: 1,
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                      side: BorderSide(color: Colors.grey.shade200),
                    ),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(14),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => IncidentTrackingScreen(incidentId: incident.id),
                          ),
                        ).then((_) => _loadIncidents());
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                SeverityChip(severity: incident.severity),
                                Text(
                                  incident.status.name.toUpperCase(),
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF1E3A8A),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              incident.title,
                              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              incident.description,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.apartment_outlined, size: 14, color: Colors.grey),
                                    const SizedBox(width: 4),
                                    Text(
                                      incident.assetCode ?? 'Asset #${incident.assetId}',
                                      style: const TextStyle(fontSize: 11, fontFamily: 'monospace'),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Text(
                                      DateFormat('dd MMM').format(incident.createdAt),
                                      style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                                    ),
                                    const SizedBox(width: 4),
                                    const Icon(Icons.chevron_right, size: 16, color: Colors.grey),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const ReportIncidentScreen()),
          ).then((_) => _loadIncidents());
        },
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }
}
