export type Node = {
  node_id: string;
  left: number;
  top: number;
  prev_node_id?: string;
  next_node_id?: string;
};

export type Template = {
  id: number;
  name: string;
  start_crush_fold: boolean;
  end_crush_fold: boolean;
  color_side_dir: boolean;
  tapered: boolean;
  nodes: Node[];
};

export type Project = {
  id: number;
  code: number;
  project_name: string;
  addresses: Address[];
};

export type Specification = {
  quantity: number;
  length: number;
  cost: number;
};

export type Flashing = {
  id: number;
  code: string;
  position: string;
  start_crush_fold: false;
  end_crush_fold: false;
  color_side_dir: false;
  tapered: false;
  nodes: Node[];
  total_girth: number;
  material_data: {
    type: string;
    name: string;
    label: string;
    value: string;
  };
  specifications: Specification[];
};

export type Address = {
  id: number;
  title: string;
  street_address: string;
  suburb: string;
  state: string;
  postcode: number;
  recipient_name: string;
  recipient_phone: number;
  full_address: string;
  distance_to_factory?: number;
  factory_address?: string;
  factory_work_desc?: string;
};

export type Order = {
  id: string;
  client: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  status:
    | "rejected"
    | "ready"
    | "completed"
    | "pending"
    | "in_progress"
    | "cancelled";
  priority: string;
  fulfillment_type: string;
  job_reference: {
    code: number;
    project_name: string;
  };
  flashings: Flashing[];
  created_at: string;
  fulfillment: {
    id: string;
    type: string;
    cost: number;
    date: string;
    address: Address;
    method: {
      _dm_type: string;
      _dm_name: string;
      _dm_description: string;
      _dm_base_cost: number;
      _dm_cost_per_kg: number;
      _dm_cost_per_km: number;
    };
    driver?: {
      name?: string;
      phone?: number;
    };
  };
  payment_history: {
    transaction_id: string;
    method: string;
    date: string;
    amount: number;
    gst: number;
    flashings_cost: number;
    delivery_cost: number;
  };
  reject_reason?: string;
};

export type Material = {
  name: string;
  id: number;
  variant_type: "color" | "thickness";
  variants: {
    id: number;
    label: string;
    value: string | number;
  }[];
};
