import 'package:flutter/material.dart';
import '../models/asset_model.dart';
import '../models/incident_model.dart';

class AssetStatusChip extends StatelessWidget {
  final AssetStatus status;

  const AssetStatusChip({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    String label;
    IconData icon;

    switch (status) {
      case AssetStatus.active:
        bg = const Color(0xFFE8F5E9);
        fg = const Color(0xFF2E7D32);
        label = 'Active';
        icon = Icons.check_circle_outline;
        break;
      case AssetStatus.maintenance:
        bg = const Color(0xFFFFF3E0);
        fg = const Color(0xFFE65100);
        label = 'Maintenance';
        icon = Icons.build_outlined;
        break;
      case AssetStatus.decommissioned:
        bg = const Color(0xFFFFEBEE);
        fg = const Color(0xFFC62828);
        label = 'Decommissioned';
        icon = Icons.block_outlined;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: fg.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: fg),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: fg,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class SeverityChip extends StatelessWidget {
  final IncidentSeverity severity;

  const SeverityChip({super.key, required this.severity});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;

    switch (severity) {
      case IncidentSeverity.critical:
        bg = Colors.red.shade50;
        fg = Colors.red.shade700;
        break;
      case IncidentSeverity.high:
        bg = Colors.orange.shade50;
        fg = Colors.orange.shade800;
        break;
      case IncidentSeverity.medium:
        bg = Colors.amber.shade50;
        fg = Colors.amber.shade900;
        break;
      case IncidentSeverity.low:
        bg = Colors.blue.shade50;
        fg = Colors.blue.shade700;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: fg.withOpacity(0.3)),
      ),
      child: Text(
        severity.name.toUpperCase(),
        style: TextStyle(
          color: fg,
          fontSize: 10,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
