import 'package:flutter/material.dart';
import '../models/incident_model.dart';
import '../models/incident_milestone_model.dart';
import '../services/incident_service.dart';
import '../widgets/milestone_timeline_tile.dart';
import '../widgets/status_chip.dart';

class IncidentTrackingScreen extends StatefulWidget {
  final int incidentId;

  const IncidentTrackingScreen({super.key, required this.incidentId});

  @override
  State<IncidentTrackingScreen> createState() => _IncidentTrackingScreenState();
}

class _IncidentTrackingScreenState extends State<IncidentTrackingScreen> {
  final IncidentService _incidentService = IncidentService();
  IncidentModel? _incident;
  bool _loading = true;
  int _currentMilestoneStep = 1; // 0=Reported, 1=In Analysis, 2=Progress, 3=Review, 4=Approved, 5=Complete

  @override
  void initState() {
    super.initState();
    _loadIncident();
  }

  Future<void> _loadIncident() async {
    setState(() => _loading = true);
    final data = await _incidentService.getIncidentById(widget.incidentId);
    if (mounted) {
      setState(() {
        _incident = data;
        _loading = false;
        if (data != null) {
          switch (data.status) {
            case IncidentStatus.reported:
              _currentMilestoneStep = 0;
              break;
            case IncidentStatus.underReview:
              _currentMilestoneStep = 1;
              break;
            case IncidentStatus.inProgress:
              _currentMilestoneStep = 2;
              break;
            case IncidentStatus.resolved:
              _currentMilestoneStep = 4;
              break;
            case IncidentStatus.closed:
              _currentMilestoneStep = 5;
              break;
          }
        }
      });
    }
  }

  Future<void> _advanceStage() async {
    if (_currentMilestoneStep >= 5) return;

    setState(() {
      _currentMilestoneStep++;
    });

    IncidentStatus newStatus;
    if (_currentMilestoneStep >= 5) {
      newStatus = IncidentStatus.closed;
    } else if (_currentMilestoneStep >= 4) {
      newStatus = IncidentStatus.resolved;
    } else if (_currentMilestoneStep >= 2) {
      newStatus = IncidentStatus.inProgress;
    } else {
      newStatus = IncidentStatus.underReview;
    }

    await _incidentService.updateIncidentStatus(
      widget.incidentId,
      newStatus,
      notes: 'Stage advanced from mobile timeline inspection',
    );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Stage advanced in shared backend: ${newStatus.name.toUpperCase()}'),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading && _incident == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Incident Tracking'),
          backgroundColor: const Color(0xFF1E3A8A),
          foregroundColor: Colors.white,
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final incident = _incident;
    if (incident == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Incident Not Found')),
        body: const Center(child: Text('The requested incident could not be found.')),
      );
    }

    final milestones = IncidentMilestone.buildMilestones(
      currentStepIndex: _currentMilestoneStep,
      createdAt: incident.createdAt,
      budget: incident.budget,
    );

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Incident #${incident.id}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const Text('Real-Time Lifecycle Tracking', style: TextStyle(fontSize: 11, color: Colors.white70)),
          ],
        ),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadIncident,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadIncident,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Summary Header Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        SeverityChip(severity: incident.severity),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            incident.status.name.toUpperCase(),
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF1D4ED8),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      incident.title,
                      style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Icon(Icons.apartment_outlined, size: 14, color: Colors.blueGrey),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            '${incident.assetName ?? "Infrastructure Asset"} (${incident.assetCode ?? "Code"})',
                            style: TextStyle(fontSize: 12, color: Colors.grey.shade700, fontWeight: FontWeight.w500),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    if (incident.budget != null) ...[
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.payments_outlined, size: 14, color: Colors.emerald),
                          const SizedBox(width: 4),
                          Text(
                            'Allocated Budget: LKR ${incident.budget!.toStringAsFixed(0)}',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF15803D)),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Wireframe Milestone Timeline Section Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Milestone Progress (6 Stages)',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.black87),
                  ),
                  Text(
                    'Stage ${_currentMilestoneStep + 1} of 6',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.blue.shade800),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Vertical Milestones Timeline
              Container(
                padding: const EdgeInsets.fromLTRB(8, 16, 8, 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: milestones.length,
                  itemBuilder: (context, index) {
                    return MilestoneTimelineTile(
                      milestone: milestones[index],
                      index: index,
                      isFirst: index == 0,
                      isLast: index == milestones.length - 1,
                    );
                  },
                ),
              ),
              const SizedBox(height: 20),

              // Interactive Stage Advancer for Demo / Evaluation
              if (_currentMilestoneStep < 5)
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0FDF4),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFBBF7D0)),
                  ),
                  child: Column(
                    children: [
                      Text(
                        'Simulate next stage progression for this incident in the shared backend API:',
                        style: TextStyle(fontSize: 12, color: Colors.green.shade900),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _advanceStage,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF16A34A),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          icon: const Icon(Icons.arrow_forward_rounded, size: 18),
                          label: Text(
                            'Advance to: ${milestones[(_currentMilestoneStep + 1).clamp(0, 5)].title}',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
