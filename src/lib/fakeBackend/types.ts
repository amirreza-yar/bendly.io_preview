// ---------- Shared Subtypes ----------
type Metadata = {
  createdAt: string
  updatedAt: string
  [key: string]: any
}

type Profile = {
  firstName: string
  lastName: string
  avatarUrl?: string
  [key: string]: any
}

type Subscription = {
  plan: string
  active: boolean
  startedAt: string
  expiresAt: string
}

type UserConfig = {
  key: string
  value: string
}

type QuickInput = {
  name: string
  value: string
}

// ---------- Collections ----------
export const collections = {
  User: class User {
    id!: string
    email!: string
    password!: string
    role!: string
    profile!: Profile
    subscription!: Subscription
    userConfigs!: UserConfig[]
    quickInputs!: QuickInput[]
    status!: string
    metadata!: Metadata
  },

  Session: class Session {
    sessionId!: string
    userId!: string
    jwtToken!: string
    userAgent!: string
    expiresAt!: string
    status!: string
    metadata!: Metadata
  },

  Design: class Design {
    ownerId!: string
    projectId!: string
    designId!: string
    designName!: string
    specs!: Record<string, any>
    folds!: string[]
    colors!: string[]
    grid!: Record<string, any>
    annotation!: Record<string, any>
    breakLines!: string[]
    output!: Record<string, any>
    revisions!: Record<string, any>[]
    status!: string
    metadata!: Metadata
  },

  Template: class Template {
    designId!: string
    ownerId!: string
    templateName!: string
    tags!: string[]
    scope!: string
    accessStatus!: string
    metadata!: Metadata
  },

  Project: class Project {
    ownerId!: string
    projectId!: string
    projectName!: string
    designs!: string[]
    orders!: string[]
    status!: string
    metadata!: Metadata
  },

  Job: class Job {
    jobId!: string
    ownerId!: string
    projectId!: string
    designId!: string
    status!: string
    metadata!: Metadata
  },

  Order: class Order {
    orderId!: string
    ownerId!: string
    projectId!: string
    designId!: string
    items!: Record<string, any>[]
    billing!: Record<string, any>
    output!: Record<string, any>
    status!: string
    metadata!: Metadata
  },

  Notification: class Notification {
    notificationId!: string
    userId!: string
    message!: string
    type!: string
    status!: string
    metadata!: Metadata
  },

  Workspace: class Workspace {
    workspaceId!: string
    ownerId!: string
    workspaceName!: string
    members!: string[]
    projects!: string[]
    designs!: string[]
    activityLog!: Record<string, any>[]
    metadata!: Metadata
  },

  Setting: class Setting {
    settingsName!: string
    settingsData!: Record<string, any>
    status!: string
    metadata!: Metadata
  },
}
// ---------- Dynamic collection map ----------
export const collectionMap: Record<string, Record<string, any>[]> = {}

for (const key of Object.keys(collections)) {
  collectionMap[key.charAt(0).toLowerCase() + key.slice(1)] = []
}

export type CollectionMap = typeof collectionMap
