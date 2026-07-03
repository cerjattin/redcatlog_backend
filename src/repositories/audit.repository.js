const { prisma } = require('../config/prisma');

const serializeAuditValue = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value, (_key, currentValue) => {
      if (typeof currentValue === 'bigint') {
        return currentValue.toString();
      }

      if (currentValue instanceof Date) {
        return currentValue.toISOString();
      }

      return currentValue;
    });
  } catch (_error) {
    return null;
  }
};

const normalizeBigIntOrNull = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return BigInt(value);
};

const createAuditLog = async (data) => {
  return prisma.auditLog.create({
    data: {
      userId: normalizeBigIntOrNull(data.userId),
      action: data.action,
      entityType: data.entityType,
      entityId: normalizeBigIntOrNull(data.entityId),
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      oldValues: serializeAuditValue(data.oldValues),
      newValues: serializeAuditValue(data.newValues),
      description: data.description || null,
    },
  });
};

module.exports = {
  createAuditLog,
};