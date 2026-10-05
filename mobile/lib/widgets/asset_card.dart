import 'package:flutter/material.dart';
import '../models/asset_model.dart';
import 'status_chip.dart';

class AssetCard extends StatelessWidget {
  final AssetModel asset;
  final VoidCallback onReportIncident;
  final VoidCallback? onTap;

  const AssetCard({
    super.key,
    required this.asset,
    required this.onReportIncident,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 1,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header: Code + Status Badge
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.blueGrey.shade50,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      asset.assetCode,
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: Colors.blueGrey.shade800,
                      ),
                    ),
                  ),
                  AssetStatusChip(status: asset.status),
                ],
              ),
              const SizedBox(height: 8),

              // Asset Name
              Text(
                asset.name,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 4),

              // Category & Location
              Row(
                children: [
                  Icon(Icons.category_outlined, size: 14, color: Colors.grey.shade600),
                  const SizedBox(width: 4),
                  Text(
                    asset.category,
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Icon(Icons.location_on_outlined, size: 14, color: Colors.grey.shade600),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      asset.location,
                      maxLines: 1,
                      overflow: TextEmphasis.ellipsis == null ? TextOverflow.ellipsis : TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(height: 1),
              const SizedBox(height: 8),

              // Footer: Incidents count + Action button
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  asset.activeIncidentsCount > 0
                      ? Row(
                          children: [
                            const Icon(Icons.warning_amber_rounded, size: 14, color: Colors.amber),
                            const SizedBox(width: 4),
                            Text(
                              '${asset.activeIncidentsCount} active issue(s)',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Colors.amber,
                              ),
                            ),
                          ],
                        )
                      : Text(
                          'No active defects',
                          style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
                        ),
                  TextButton.icon(
                    onPressed: onReportIncident,
                    icon: const Icon(Icons.add_alert_outlined, size: 16),
                    label: const Text('Report Defect', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    style: TextButton.styleFrom(
                      foregroundColor: const Color(0xFF1E3A8A),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
