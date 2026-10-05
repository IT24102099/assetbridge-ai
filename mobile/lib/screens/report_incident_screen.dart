import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/asset_model.dart';
import '../models/incident_model.dart';
import '../services/incident_service.dart';
import 'incident_tracking_screen.dart';

class ReportIncidentScreen extends StatefulWidget {
  final int? preselectedAssetId;
  final String? preselectedAssetName;

  const ReportIncidentScreen({
    super.key,
    this.preselectedAssetId,
    this.preselectedAssetName,
  });

  @override
  State<ReportIncidentScreen> createState() => _ReportIncidentScreenState();
}

class _ReportIncidentScreenState extends State<ReportIncidentScreen> {
  final _formKey = GlobalKey<FormState>();
  final IncidentService _incidentService = IncidentService();

  List<AssetModel> _assets = [];
  int? _selectedAssetId;
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _budgetController = TextEditingController();
  DateTime? _selectedDate;
  IncidentSeverity _severity = IncidentSeverity.medium;
  String? _selectedPhotoUrl;
  bool _submitting = false;

  final List<Map<String, String>> _sampleEvidencePhotos = [
    {
      'label': 'Water Pipe Burst',
      'url': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    },
    {
      'label': 'Generator Overheating',
      'url': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    },
    {
      'label': 'Debris Jam',
      'url': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    },
  ];

  @override
  void initState() {
    super.initState();
    _selectedAssetId = widget.preselectedAssetId;
    _selectedDate = DateTime.now().add(const Duration(days: 3));
    _loadAssets();
  }

  Future<void> _loadAssets() async {
    final assets = await _incidentService.getMyAssets();
    if (mounted) {
      setState(() {
        _assets = assets;
        if (_selectedAssetId == null && assets.isNotEmpty) {
          _selectedAssetId = assets.first.id;
        }
      });
    }
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  void _showImagePickerSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Attach Inspection Photo',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              'Use your camera or select preset evidence images',
              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
            ),
            const SizedBox(height: 20),

            // Camera & Gallery Buttons Mockup
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pop(ctx);
                      setState(() {
                        _selectedPhotoUrl = _sampleEvidencePhotos[0]['url'];
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Simulated camera capture: Pipe Leak photo attached')),
                      );
                    },
                    icon: const Icon(Icons.camera_alt_outlined),
                    label: const Text('Take Photo'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pop(ctx);
                      setState(() {
                        _selectedPhotoUrl = _sampleEvidencePhotos[1]['url'];
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Simulated gallery pick: Generator defect photo attached')),
                      );
                    },
                    icon: const Icon(Icons.photo_library_outlined),
                    label: const Text('From Gallery'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 8),

            // Preset Presets
            const Text('Or select preset defect evidence:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: _sampleEvidencePhotos.map((photo) {
                return ActionChip(
                  avatar: const Icon(Icons.image_outlined, size: 14),
                  label: Text(photo['label']!, style: const TextStyle(fontSize: 11)),
                  onPressed: () {
                    Navigator.pop(ctx);
                    setState(() => _selectedPhotoUrl = photo['url']);
                  },
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submitReport() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedAssetId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select an infrastructure asset')),
      );
      return;
    }

    setState(() => _submitting = true);

    try {
      final double? budget = _budgetController.text.isNotEmpty
          ? double.tryParse(_budgetController.text.trim())
          : null;

      final incident = await _incidentService.reportIncident(
        assetId: _selectedAssetId!,
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        severity: _severity,
        budget: budget,
        preferredDate: _selectedDate,
        photoUrl: _selectedPhotoUrl,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Color(0xFF10B981),
            content: Text('Defect incident reported! Incident Planning Agent engaged.'),
          ),
        );

        // Navigate to tracking screen
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => IncidentTrackingScreen(incidentId: incident.id),
          ),
        );
      }
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error reporting incident: $err')),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Report Defect / Incident', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFBFDBFE)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, color: Color(0xFF1D4ED8), size: 24),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Your report triggers the AI Incident Planning Agent to triage defect severity and recommend vetted contractors.',
                        style: TextStyle(fontSize: 12, color: Colors.blue.shade900, height: 1.3),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Asset Selector
              const Text('Target Infrastructure Asset *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<int>(
                    value: _selectedAssetId,
                    isExpanded: true,
                    hint: const Text('Select Asset'),
                    items: _assets.map((a) {
                      return DropdownMenuItem<int>(
                        value: a.id,
                        child: Text(
                          '${a.assetCode} — ${a.name}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 13),
                        ),
                      );
                    }).toList(),
                    onChanged: (val) => setState(() => _selectedAssetId = val),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Problem Title
              const Text('Defect Headline / Title *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _titleController,
                validator: (val) => val == null || val.trim().isEmpty ? 'Title is required' : null,
                decoration: InputDecoration(
                  hintText: 'e.g. Kitchen Water Pipe Burst / Sensor Failure',
                  hintStyle: TextStyle(fontSize: 13, color: Colors.grey.shade400),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade300)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade300)),
                ),
              ),
              const SizedBox(height: 16),

              // Problem Description
              const Text('Problem Description *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _descriptionController,
                maxLines: 4,
                validator: (val) => val == null || val.trim().isEmpty ? 'Description is required' : null,
                decoration: InputDecoration(
                  hintText: 'Describe visible damage, leak rate, sounds, warning codes, or tenant impact...',
                  hintStyle: TextStyle(fontSize: 13, color: Colors.grey.shade400),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade300)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade300)),
                ),
              ),
              const SizedBox(height: 16),

              // Severity & Estimated Budget Row
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Severity Dropdown
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Severity Level', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.grey.shade300),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<IncidentSeverity>(
                              value: _severity,
                              isExpanded: true,
                              items: IncidentSeverity.values.map((s) {
                                return DropdownMenuItem(
                                  value: s,
                                  child: Text(s.name.toUpperCase(), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                );
                              }).toList(),
                              onChanged: (val) {
                                if (val != null) setState(() => _severity = val);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Budget Field
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Budget (LKR)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        const SizedBox(height: 6),
                        TextFormField(
                          controller: _budgetController,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            hintText: 'e.g. 50000',
                            hintStyle: TextStyle(fontSize: 13, color: Colors.grey.shade400),
                            prefixText: 'LKR ',
                            filled: true,
                            fillColor: Colors.white,
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade300)),
                            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade300)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Date Picker
              const Text('Preferred Resolution Deadline', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 6),
              InkWell(
                onTap: _pickDate,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text(
                        _selectedDate != null ? DateFormat('EEEE, dd MMMM yyyy').format(_selectedDate!) : 'Select Target Date',
                        style: const TextStyle(fontSize: 13),
                      ),
                      const Icon(Icons.calendar_month_outlined, size: 20, color: Color(0xFF1E3A8A)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Device Image Picker Mockup
              const Text('Photo Evidence & Damage Media', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 6),
              if (_selectedPhotoUrl == null)
                InkWell(
                  onTap: _showImagePickerSheet,
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    height: 110,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.shade300, style: BorderStyle.solid),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.add_a_photo_outlined, size: 32, color: Colors.blueGrey.shade400),
                        const SizedBox(height: 6),
                        Text(
                          'Tap to attach camera or gallery photo',
                          style: TextStyle(fontSize: 12, color: Colors.grey.shade600, fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  ),
                )
              else
                Stack(
                  children: [
                    Container(
                      height: 160,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade300),
                        image: DecorationImage(
                          image: NetworkImage(_selectedPhotoUrl!),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: CircleAvatar(
                        backgroundColor: Colors.black54,
                        radius: 16,
                        child: IconButton(
                          padding: EdgeInsets.zero,
                          icon: const Icon(Icons.close, color: Colors.white, size: 18),
                          onPressed: () => setState(() => _selectedPhotoUrl = null),
                        ),
                      ),
                    ),
                  ],
                ),
              const SizedBox(height: 28),

              // Submit Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _submitting ? null : _submitReport,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1E3A8A),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 2,
                  ),
                  icon: _submitting
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.send_rounded),
                  label: Text(
                    _submitting ? 'Submitting Report...' : 'Submit Incident Report',
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
