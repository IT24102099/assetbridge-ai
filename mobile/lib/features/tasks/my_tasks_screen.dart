import 'package:flutter/material.dart';
import '../../models/visit_task_model.dart';
import '../../widgets/task_card.dart';
import '../visits/update_visit_screen.dart';

class MyTasksScreen extends StatefulWidget {
  const MyTasksScreen({super.key});

  @override
  State<MyTasksScreen> createState() => _MyTasksScreenState();
}

class _MyTasksScreenState extends State<MyTasksScreen> {
  final List<VisitTaskModel> _tasks = [
    VisitTaskModel(
      id: 'task-101',
      title: 'HVAC Unit Routine Inspection & Cooling Check',
      assetCode: 'AST-8001',
      providerName: 'Apex Maintenance Services Ltd.',
      location: 'North Warehouse 4',
      date: '2026-10-06',
      time: '09:00 AM',
      status: 'Active',
      notes: 'Check refrigerant pressure and air handler filters.',
    ),
    VisitTaskModel(
      id: 'task-102',
      title: 'Structural Laser Thermal Audit',
      assetCode: 'AST-8002',
      providerName: 'Vanguard Structural Inspections',
      location: 'South Office Tower',
      date: '2026-10-06',
      time: '01:30 PM',
      status: 'In Progress',
      notes: 'Roof access permits obtained.',
    ),
    VisitTaskModel(
      id: 'task-103',
      title: 'Machinery Inventory Valuation',
      assetCode: 'AST-8003',
      providerName: 'Precision Asset Valuations',
      location: 'East Industrial Hub',
      date: '2026-10-07',
      time: '10:00 AM',
      status: 'Pending',
      notes: 'Appraiser onsite review.',
    ),
    VisitTaskModel(
      id: 'task-104',
      title: 'Hydraulic System Rebuild Audit',
      assetCode: 'AST-8006',
      providerName: 'Titan Heavy Machinery Services',
      location: 'Central Plant',
      date: '2026-10-05',
      time: '04:00 PM',
      status: 'Completed',
      notes: 'Overhaul verified and signed off.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text('My Representative Tasks', style: TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _tasks.length,
        itemBuilder: (context, index) {
          final task = _tasks[index];
          return TaskCard(
            task: task,
            onTap: () async {
              final updated = await Navigator.of(context).push<VisitTaskModel>(
                MaterialPageRoute(builder: (_) => UpdateVisitScreen(task: task)),
              );
              if (updated != null) {
                setState(() {
                  _tasks[index] = updated;
                });
              }
            },
          );
        },
      ),
    );
  }
}
