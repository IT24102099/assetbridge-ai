import 'package:flutter/material.dart';

class StatusBadge extends StatelessWidget {
  final String status;

  const StatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    final s = status.toUpperCase();
    Color bg = const Color(0xFFEFF6FF);
    Color fg = const Color(0xFF1D4ED8);

    if (s == 'VERIFIED' || s == 'ACTIVE' || s == 'COMPLETED' || s == 'AVAILABLE') {
      bg = const Color(0xFFDCFCE7);
      fg = const Color(0xFF15803D);
    } else if (s == 'PENDING' || s == 'BUSY' || s == 'IN PROGRESS') {
      bg = const Color(0xFFFEF3C7);
      fg = const Color(0xFFB45309);
    } else if (s == 'UNVERIFIED' || s == 'INACTIVE' || s == 'UNAVAILABLE') {
      bg = const Color(0xFFFEE2E2);
      fg = const Color(0xFFB91C1C);
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        s,
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
