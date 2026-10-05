enum MilestoneState { completed, current, pending }

class IncidentMilestone {
  final String title;
  final String description;
  final MilestoneState state;
  final DateTime? timestamp;
  final String? actorOrAgent;
  final String? note;

  IncidentMilestone({
    required this.title,
    required this.description,
    required this.state,
    this.timestamp,
    this.actorOrAgent,
    this.note,
  });

  /// Builds the 6-stage lifecycle milestones according to the AssetBridge AI workflow
  static List<IncidentMilestone> buildMilestones({
    required int currentStepIndex, // 0 to 5
    required DateTime createdAt,
    String? assignedProvider,
    double? budget,
  }) {
    final now = DateTime.now();

    final templates = [
      {
        'title': 'Reported',
        'desc': 'Defect reported by owner with location and media evidence.',
        'actor': 'Asset Owner / Inspector',
        'note': 'Initial priority established',
      },
      {
        'title': 'In Analysis',
        'desc': 'Incident Planning Agent analyzed defect scope and matched repair manuals.',
        'actor': 'Incident Planning Agent (AI)',
        'note': 'Damage triage score: 84/100',
      },
      {
        'title': 'Progress',
        'desc': 'Local representative assigned and on-site provider dispatched.',
        'actor': assignedProvider ?? 'QuickFix Engineering (Pvt) Ltd',
        'note': 'Technician dispatched to facility',
      },
      {
        'title': 'Review',
        'desc': 'Inspection assessment and detailed repair quotation submitted.',
        'actor': 'Provider Intelligence Agent',
        'note': budget != null ? 'Estimated cost: LKR ${budget.toStringAsFixed(0)}' : 'Quotation ready for review',
      },
      {
        'title': 'Approved',
        'desc': 'Human-in-the-loop authorization confirmed for work execution.',
        'actor': 'Owner Approval Gateway',
        'note': 'Payment escrow reserved',
      },
      {
        'title': 'Complete',
        'desc': 'Physical repair completed, after-photos verified, asset restored.',
        'actor': 'Validation & Continuity Agent',
        'note': 'Quality assurance pass 100%',
      },
    ];

    return List.generate(templates.length, (index) {
      MilestoneState state;
      DateTime? time;

      if (index < currentStepIndex) {
        state = MilestoneState.completed;
        time = createdAt.add(Duration(hours: index * 4));
      } else if (index == currentStepIndex) {
        state = MilestoneState.current;
        time = now;
      } else {
        state = MilestoneState.pending;
        time = null;
      }

      return IncidentMilestone(
        title: templates[index]['title']!,
        description: templates[index]['desc']!,
        state: state,
        timestamp: time,
        actorOrAgent: templates[index]['actor'],
        note: templates[index]['note'],
      );
    });
  }
}
