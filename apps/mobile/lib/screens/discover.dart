import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class DiscoverScreen extends StatelessWidget {
  const DiscoverScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final profiles = List.generate(10, (i) => {
      'name': '사용자 ${i+1}',
      'age': 20 + i,
      'region': '서울',
      'bio': '대화환영! 영화/음악/여행 좋아해요.',
    });

    return Scaffold(
      appBar: AppBar(title: const Text('탐색')),
      body: ListView.separated(
        itemCount: profiles.length,
        separatorBuilder: (_, __) => const Divider(height: 1),
        itemBuilder: (context, i) {
          final p = profiles[i];
          return ListTile(
            leading: CircleAvatar(child: Text('${p['age']}')),
            title: Text(p['name'] as String),
            subtitle: Text('${p['region']} · ${p['bio']}'),
            trailing: FilledButton(
              onPressed: () => context.go('/chat'),
              child: const Text('친구신청'),
            ),
          );
        },
      ),
    );
  }
}
