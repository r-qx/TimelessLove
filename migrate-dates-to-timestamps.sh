#!/bin/bash

# MongoDB 数据库日期字段迁移脚本
# 将所有 Date 类型字段转换为时间戳（Number）

echo "🔄 开始数据库迁移：将 Date 类型转换为时间戳"
echo "========================================"
echo ""

# 数据库名称
DB_NAME="timeless_love"

echo "📋 数据库：$DB_NAME"
echo ""

# 1. 迁移 users 集合
echo "1️⃣ 迁移 users 集合..."
mongosh $DB_NAME <<EOF
db.users.find({ 
  \$or: [
    { birthday: { \$type: "date" } },
    { created_at: { \$type: "date" } },
    { updated_at: { \$type: "date" } }
  ]
}).forEach(function(doc) {
  var update = {};
  
  if (doc.birthday && typeof doc.birthday.getTime === 'function') {
    update.birthday = doc.birthday.getTime();
  }
  if (doc.created_at && typeof doc.created_at.getTime === 'function') {
    update.created_at = doc.created_at.getTime();
  }
  if (doc.updated_at && typeof doc.updated_at.getTime === 'function') {
    update.updated_at = doc.updated_at.getTime();
  }
  
  if (Object.keys(update).length > 0) {
    db.users.updateOne({ _id: doc._id }, { \$set: update });
    print('Updated user:', doc._id);
  }
});
print('✅ users 集合迁移完成');
EOF

# 2. 迁移 couples 集合
echo ""
echo "2️⃣ 迁移 couples 集合..."
mongosh $DB_NAME <<EOF
db.couples.find({ 
  \$or: [
    { anniversary: { \$type: "date" } },
    { created_at: { \$type: "date" } },
    { updated_at: { \$type: "date" } }
  ]
}).forEach(function(doc) {
  var update = {};
  
  if (doc.anniversary && typeof doc.anniversary.getTime === 'function') {
    update.anniversary = doc.anniversary.getTime();
  }
  if (doc.created_at && typeof doc.created_at.getTime === 'function') {
    update.created_at = doc.created_at.getTime();
  }
  if (doc.updated_at && typeof doc.updated_at.getTime === 'function') {
    update.updated_at = doc.updated_at.getTime();
  }
  
  if (Object.keys(update).length > 0) {
    db.couples.updateOne({ _id: doc._id }, { \$set: update });
    print('Updated couple:', doc._id);
  }
});
print('✅ couples 集合迁移完成');
EOF

# 3. 迁移 tasks 集合
echo ""
echo "3️⃣ 迁移 tasks 集合..."
mongosh $DB_NAME <<EOF
db.tasks.find({
  \$or: [
    { deadline: { \$type: "date" } },
    { verified_at: { \$type: "date" } },
    { 'proof.submitted_at': { \$type: "date" } },
    { created_at: { \$type: "date" } },
    { updated_at: { \$type: "date" } }
  ]
}).forEach(function(doc) {
  var update = {};
  
  if (doc.deadline && typeof doc.deadline.getTime === 'function') {
    update.deadline = doc.deadline.getTime();
  }
  if (doc.verified_at && typeof doc.verified_at.getTime === 'function') {
    update.verified_at = doc.verified_at.getTime();
  }
  if (doc.proof && doc.proof.submitted_at && typeof doc.proof.submitted_at.getTime === 'function') {
    update['proof.submitted_at'] = doc.proof.submitted_at.getTime();
  }
  if (doc.created_at && typeof doc.created_at.getTime === 'function') {
    update.created_at = doc.created_at.getTime();
  }
  if (doc.updated_at && typeof doc.updated_at.getTime === 'function') {
    update.updated_at = doc.updated_at.getTime();
  }
  
  if (Object.keys(update).length > 0) {
    db.tasks.updateOne({ _id: doc._id }, { \$set: update });
    print('Updated task:', doc._id);
  }
});
print('✅ tasks 集合迁移完成');
EOF

# 4. 迁移 moments 集合
echo ""
echo "4️⃣ 迁移 moments 集合..."
mongosh $DB_NAME <<EOF
db.moments.find({
  \$or: [
    { created_at: { \$type: "date" } },
    { updated_at: { \$type: "date" } }
  ]
}).forEach(function(doc) {
  var update = {};
  
  if (doc.created_at && typeof doc.created_at.getTime === 'function') {
    update.created_at = doc.created_at.getTime();
  }
  if (doc.updated_at && typeof doc.updated_at.getTime === 'function') {
    update.updated_at = doc.updated_at.getTime();
  }
  
  if (Object.keys(update).length > 0) {
    db.moments.updateOne({ _id: doc._id }, { \$set: update });
    print('Updated moment:', doc._id);
  }
});
print('✅ moments 集合迁移完成');
EOF

# 5. 迁移 messages 集合
echo ""
echo "5️⃣ 迁移 messages 集合..."
mongosh $DB_NAME <<EOF
db.messages.find({
  \$or: [
    { created_at: { \$type: "date" } },
    { updated_at: { \$type: "date" } }
  ]
}).forEach(function(doc) {
  var update = {};
  
  if (doc.created_at && typeof doc.created_at.getTime === 'function') {
    update.created_at = doc.created_at.getTime();
  }
  if (doc.updated_at && typeof doc.updated_at.getTime === 'function') {
    update.updated_at = doc.updated_at.getTime();
  }
  
  if (Object.keys(update).length > 0) {
    db.messages.updateOne({ _id: doc._id }, { \$set: update });
    print('Updated message:', doc._id);
  }
});
print('✅ messages 集合迁移完成');
EOF

echo ""
echo "========================================"
echo "🎉 数据库迁移完成！"
echo ""
echo "📊 验证迁移结果："
mongosh $DB_NAME <<EOF
print('users 集合统计:');
print('  总数:', db.users.countDocuments());
print('  Date 类型:', db.users.countDocuments({ created_at: { \$type: "date" } }));
print('  Number 类型:', db.users.countDocuments({ created_at: { \$type: "number" } }));
print('');
print('couples 集合统计:');
print('  总数:', db.couples.countDocuments());
print('  Date 类型:', db.couples.countDocuments({ created_at: { \$type: "date" } }));
print('  Number 类型:', db.couples.countDocuments({ created_at: { \$type: "number" } }));
print('');
print('tasks 集合统计:');
print('  总数:', db.tasks.countDocuments());
print('  Date 类型:', db.tasks.countDocuments({ created_at: { \$type: "date" } }));
print('  Number 类型:', db.tasks.countDocuments({ created_at: { \$type: "number" } }));
print('');
print('moments 集合统计:');
print('  总数:', db.moments.countDocuments());
print('  Date 类型:', db.moments.countDocuments({ created_at: { \$type: "date" } }));
print('  Number 类型:', db.moments.countDocuments({ created_at: { \$type: "number" } }));
print('');
print('messages 集合统计:');
print('  总数:', db.messages.countDocuments());
print('  Date 类型:', db.messages.countDocuments({ created_at: { \$type: "date" } }));
print('  Number 类型:', db.messages.countDocuments({ created_at: { \$type: "number" } }));
EOF

echo ""
echo "✅ 全部完成！"
