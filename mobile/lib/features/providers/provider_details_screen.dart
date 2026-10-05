import 'package:flutter/material.dart';
import '../../services/provider_coordination_service.dart';
import '../../models/provider_model.dart';
import '../../models/availability_model.dart';
import '../../widgets/status_badge.dart';

class ProviderDetailsScreen extends StatefulWidget {
  final String providerId;

  const ProviderDetailsScreen({super.key, required this.providerId});

  @override
  State<ProviderDetailsScreen> createState() => _ProviderDetailsScreenState();
}

class _ProviderDetailsScreenState extends State<ProviderDetailsScreen> {
  final ProviderCoordinationService _service = ProviderCoordinationService();
  ServiceProviderModel? _provider;
  List<AvailabilitySlotModel> _availabilitySlots = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDetails();
  }

  Future<void> _loadDetails() async {
    final prov = await _service.getProviderById(widget.providerId);
    final slots = await _service.getProviderAvailability(widget.providerId);
    if (mounted) {
      setState(() {
        _provider = prov;
        _availabilitySlots = slots;
        _isLoading = false;
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
        title: const Text('Provider Profile', style: TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _provider == null
              ? const Center(child: Text('Provider details not found.'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAlignment.start,
                    children: [
                      // Header Card
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAlignment.start,
                          children: [
                            Row(
                              children: [
                                CircleAvatar(
                                  radius: 28,
                                  backgroundColor: const Color(0xFFEFF6FF),
                                  child: Text(
                                    _provider!.companyName.substring(0, 2).toUpperCase(),
                                    style: const TextStyle(fontSize: 18, color: Color(0xFF1E3A8A), fontWeight: FontWeight.bold),
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAlignment.start,
                                    children: [
                                      Text(_provider!.companyName, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                                      const SizedBox(height: 4),
                                      Text('Code: ${_provider!.code}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                                    ],
                                  ),
                                ),
                                StatusBadge(status: _provider!.verificationStatus),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Text(_provider!.description, style: const TextStyle(fontSize: 13, color: Color(0xFF334155), height: 1.4)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Contact & Info Card
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
                            const Text('Contact & Location', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                            const SizedBox(height: 12),
                            _buildInfoRow(Icons.person_outline, 'Contact Person', _provider!.contactPerson),
                            _buildInfoRow(Icons.email_outlined, 'Email', _provider!.email),
                            _buildInfoRow(Icons.phone_outlined, 'Phone', _provider!.phone),
                            _buildInfoRow(Icons.location_on_outlined, 'Address', _provider!.address),
                            _buildInfoRow(Icons.star_outline, 'Rating & Jobs', '${_provider!.rating} / 5.0 (${_provider!.jobsCount} jobs completed)'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Availability Schedule Card
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
                            const Text('Calendar Availability Schedule', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                            const SizedBox(height: 12),
                            _availabilitySlots.isEmpty
                                ? const Text('No availability slots recorded for this provider.', style: TextStyle(fontSize: 12, color: Colors.grey))
                                : Column(
                                    children: _availabilitySlots.map((slot) {
                                      return Container(
                                        margin: const EdgeInsets.only(bottom: 8),
                                        padding: const EdgeInsets.all(12),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFF8FAFC),
                                          borderRadius: BorderRadius.circular(10),
                                          border: Border.all(color: Colors.grey.shade200),
                                        ),
                                        child: Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Column(
                                              crossAxisAlignment: CrossAlignment.start,
                                              children: [
                                                Text(slot.date, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                                const SizedBox(height: 2),
                                                Text('${slot.startTime} - ${slot.endTime}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                                              ],
                                            ),
                                            StatusBadge(status: slot.status),
                                          ],
                                        ),
                                      );
                                    }).toList(),
                                  ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAlignment.start,
        children: [
          Icon(icon, size: 16, color: const Color(0xFF1E3A8A)),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                Text(value, style: const TextStyle(fontSize: 13, color: Color(0xFF0F172A))),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
