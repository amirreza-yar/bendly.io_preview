import { collectionMap } from './types'
import { create } from './fakeDB'

export function seedInit() {
  const now = new Date().toISOString()

  const demoData: Record<keyof typeof collectionMap, Record<string, any>[]> = {
    user: [
      {
        email: 'john@example.com',
        password: 'hashedpassword',
        role: 'admin',
        profile: { firstName: 'John', lastName: 'Doe', avatarUrl: '' },
        subscription: { plan: 'pro', active: true, startedAt: now, expiresAt: now },
        userConfigs: [],
        quickInputs: [],
        status: 'active',
        metadata: { createdAt: now, updatedAt: now },
      },
    ],

    session: [
      {
        sessionId: 'sess-1',
        userId: '1',
        jwtToken: 'some.jwt.token',
        userAgent: 'Mozilla/5.0',
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: 'active',
        metadata: { createdAt: now, updatedAt: now },
      },
    ],

    design: [
      {
        ownerId: '1',
        projectId: 'proj-1',
        designId: 'design-1',
        designName: 'Sample Design',
        specs: {},
        folds: [],
        colors: [],
        grid: {},
        annotation: {},
        breakLines: [],
        output: {},
        revisions: [],
        status: 'active',
        metadata: { createdAt: now, updatedAt: now },
      },
    ],

    template: [
      {
        designId: 'design-1',
        ownerId: '1',
        templateName: 'Template One',
        tags: ['tag1', 'tag2'],
        scope: 'public',
        accessStatus: 'open',
        metadata: { createdAt: now, updatedAt: now },
      },
    ],

    project: [
      {
        ownerId: '1',
        projectId: 'proj-1',
        projectName: 'Project Alpha',
        designs: ['design-1'],
        orders: ['order-1'],
        status: 'active',
        metadata: { createdAt: now, updatedAt: now },
      },
    ],

    job: [
      {
        jobId: 'job-1',
        ownerId: '1',
        projectId: 'proj-1',
        designId: 'design-1',
        status: 'pending',
        metadata: { createdAt: now, updatedAt: now },
      },
    ],

    order: [
      {
        orderId: 'order-1',
        ownerId: '1',
        projectId: 'proj-1',
        designId: 'design-1',
        items: [],
        billing: {},
        output: {},
        status: 'new',
        metadata: { createdAt: now, updatedAt: now },
      },
    ],

    notification: [
      {
        notificationId: 'notif-1',
        userId: '1',
        message: 'Welcome to the system!',
        type: 'info',
        status: 'unread',
        metadata: { createdAt: now, updatedAt: now },
      },
    ],

    workspace: [
      {
        workspaceId: 'ws-1',
        ownerId: '1',
        workspaceName: 'Main Workspace',
        members: ['1'],
        projects: ['proj-1'],
        designs: ['design-1'],
        activityLog: [],
        metadata: { createdAt: now, updatedAt: now },
      },
    ],

    setting: [
      {
        settingsName: 'default',
        settingsData: {},
        status: 'active',
        metadata: { createdAt: now, updatedAt: now },
      },
    ],
  }

  try {
    for (const [collection, data] of Object.entries(demoData)) {
      if (data.length) {
        create(collection as keyof typeof collectionMap, data[0] as any)
      }
    }
  } catch (err: any) {
    console.error('Seeding failed:', err)
  }
}
