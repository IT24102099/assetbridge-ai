class RepresentativeModel {
  final String id;
  final String code;
  final String name;
  final String role;
  final String email;
  final String phone;
  final String location;
  final String status;
  final String verificationStatus;
  final List<String> skills;
  final List<String> assignedAssets;
  final String notes;

  RepresentativeModel({
    required this.id,
    required this.code,
    required this.name,
    required this.role,
    required this.email,
    required this.phone,
    required this.location,
    required this.status,
    required this.verificationStatus,
    required this.skills,
    required this.assignedAssets,
    required this.notes,
  });

  factory RepresentativeModel.fromJson(Map<String, dynamic> json) {
    return RepresentativeModel(
      id: json['id'] ?? '',
      code: json['code'] ?? '',
      name: json['name'] ?? 'Field Representative',
      role: json['role'] ?? 'Coordinator',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      location: json['location'] ?? 'North Region',
      status: json['status'] ?? 'ACTIVE',
      verificationStatus: json['verificationStatus'] ?? 'VERIFIED',
      skills: List<String>.from(json['skills'] ?? []),
      assignedAssets: List<String>.from(json['assignedAssets'] ?? []),
      notes: json['notes'] ?? '',
    );
  }
}
