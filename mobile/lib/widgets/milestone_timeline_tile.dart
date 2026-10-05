import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/incident_milestone_model.dart';

class MilestoneTimelineTile extends StatelessWidget {
  final IncidentMilestone milestone;
  final int index;
  final bool isFirst;
  final bool isLast;

  const MilestoneTimelineTile({
    super.key,
    required this.milestone,
    required this.index,
    this.isFirst = false,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDone = milestone.state == MilestoneState.completed;
    final isCurrent = milestone.state == MilestoneState.current;

    Color nodeColor;
    Color nodeIconColor;
    IconData nodeIcon;

    if (isDone) {
      nodeColor = const Color(0xFF10B981);
      nodeIconColor = Colors.white;
      nodeIcon = Icons.check;
    } else if (isCurrent) {
      nodeColor = const Color(0xFF2563EB);
      nodeIconColor = Colors.white;
      nodeIcon = Icons.play_arrow_rounded;
    } else {
      nodeColor = Colors.grey.shade300;
      nodeIconColor = Colors.grey.shade600;
      nodeIcon = Icons.circle;
    }

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Left: Vertical Line & Node Circle
          SizedBox(
            width: 40,
            child: Column(
              children: [
                // Top connector line
                Container(
                  width: 2,
                  height: 12,
                  color: isFirst
                      ? Colors.transparent
                      : (isDone || isCurrent ? const Color(0xFF10B981) : Colors.grey.shade300),
                ),
                // Indicator Node
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: nodeColor,
                    shape: BoxShape.circle,
                    boxShadow: isCurrent
                        ? [
                            BoxShadow(
                              color: const Color(0xFF2563EB).withOpacity(0.35),
                              blurRadius: 8,
                              spreadRadius: 2,
                            )
                          ]
                        : null,
                  ),
                  child: Center(
                    child: Icon(
                      nodeIcon,
                      size: isDone ? 16 : (isCurrent ? 18 : 8),
                      color: nodeIconColor,
                    ),
                  ),
                ),
                // Bottom connector line
                Expanded(
                  child: Container(
                    width: 2,
                    color: isLast
                        ? Colors.transparent
                        : (isDone ? const Color(0xFF10B981) : Colors.grey.shade300),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),

          // Right: Milestone Card
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 20),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isCurrent
                      ? const Color(0xFFEFF6FF)
                      : (isDone ? Colors.white : Colors.grey.shade50),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isCurrent
                        ? const Color(0xFF93C5FD)
                        : (isDone ? Colors.grey.shade200 : Colors.grey.shade200),
                    width: isCurrent ? 1.5 : 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.02),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header: Stage Title & Timestamp
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Text(
                          '${index + 1}. ${milestone.title}',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: isCurrent
                                ? const Color(0xFF1E40AF)
                                : (isDone ? Colors.black87 : Colors.grey.shade600),
                          ),
                        ),
                        if (milestone.timestamp != null)
                          Text(
                            DateFormat('dd MMM, hh:mm a').format(milestone.timestamp!),
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey.shade600,
                              fontFamily: 'monospace',
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 6),

                    // Description
                    Text(
                      milestone.description,
                      style: TextStyle(
                        fontSize: 13,
                        color: isCurrent ? Colors.blueGrey.shade900 : Colors.grey.shade700,
                        height: 1.35,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Metadata Footer: Agent / Actor & Note
                    Row(
                      children: [
                        if (milestone.actorOrAgent != null) ...[
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                            decoration: BoxDecoration(
                              color: isCurrent ? const Color(0xFFDBEAFE) : Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  milestone.actorOrAgent!.contains('Agent')
                                      ? Icons.smart_toy_outlined
                                      : Icons.person_outline,
                                  size: 11,
                                  color: isCurrent ? const Color(0xFF1D4ED8) : Colors.grey.shade700,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  milestone.actorOrAgent!,
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: isCurrent ? const Color(0xFF1D4ED8) : Colors.grey.shade700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                        ],
                        if (milestone.note != null)
                          Expanded(
                            child: Text(
                              milestone.note!,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 11,
                                fontStyle: FontStyle.italic,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
