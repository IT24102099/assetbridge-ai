class ServiceProviderModel {
  final String id;
  final String code;
  final String companyName;
  final String contactPerson;
  final String email;
  final String phone;
  final String address;
  final String location;
  final List<String> skills;
  final List<String> serviceAreas;
  final double rating;
  final int jobsCount;
  final String verificationStatus;
  final String insuranceStatus;
  final String description;
  final double distanceKm;
  final String availabilityStatus;

  ServiceProviderModel({
    required this.id,
    required this.code,
    required this.companyName,
    required this.contactPerson,
    required this.email,
    required this.phone,
    required this.address,
    required this.location,
    required this.skills,
    required this.serviceAreas,
    required this.rating,
    required this.jobsCount,
    required this.verificationStatus,
    required this.insuranceStatus,
    required this.description,
    this.distanceKm = 10.0,
    this.availabilityStatus = 'AVAILABLE',
  });

  factory ServiceProviderModel.fromJson(Map<String, dynamic> json) {
    Map<String, dynamic> pData = json;
    if (json.containsKey('provider') && json['provider'] is Map<String, dynamic>) {
      pData = json['provider'];
    }

    return ServiceProviderModel(
      id: pData['id'] ?? '',
      code: pData['code'] ?? '',
      companyName: pData['companyName'] ?? 'Service Provider',
      contactPerson: pData['contactPerson'] ?? '',
      email: pData['email'] ?? '',
      phone: pData['phone'] ?? '',
      address: pData['address'] ?? '',
      location: pData['location'] ?? 'North Region',
      skills: List<String>.from(pData['skills'] ?? []),
      serviceAreas: List<String>.from(pData['serviceAreas'] ?? []),
      rating: (pData['rating'] as num?)?.toDouble() ?? 4.8,
      jobsCount: (pData['jobsCount'] as num?)?.toInt() ?? 0,
      verificationStatus: pData['verificationStatus'] ?? 'VERIFIED',
      insuranceStatus: pData['insuranceStatus'] ?? 'VERIFIED',
      description: pData['description'] ?? '',
      distanceKm: (json['distance'] as num?)?.toDouble() ?? 10.0,
      availabilityStatus: json['availability'] ?? 'AVAILABLE',
    );
  }
}
