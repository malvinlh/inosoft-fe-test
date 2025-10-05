export const itemsFixture = [
  {
    id_item: 'ITM001278',
    item_code: 'ITM001278',
    item_desc: 'Casing 13 3/8", 68 PPF, L80, JFELION, R3, Coated',
    lots: [
      { lotNo: 'PO-2024-00457-A-RR', allocation: 'Unallocated', owner: 'OFFSHORE', condition: 'good', availableQty: 12 },
      { lotNo: 'LOT-AX-001', allocation: 'Project A', owner: 'MITME', condition: 'good', availableQty: 8 }
    ]
  },
  {
    id_item: 'ITM002345',
    item_code: 'ITM002345',
    item_desc: 'Tubing 2 7/8", N80, R2',
    lots: [
      { lotNo: 'LOT-BX-777', allocation: 'Project B', owner: 'ONSHORE', condition: 'quarantine', availableQty: 10 },
      { lotNo: 'LOT-ZZ-123', allocation: 'Unallocated', owner: 'ONSHORE', condition: 'damaged', availableQty: 5 }
    ]
  }
];

export const dropdownsFixture = {
  serviceTypes: [
    { id: 'new-arrival', name: 'New Arrival' },
    { id: 'maintenance', name: 'Maintenance' },
    { id: 'on-spot', name: 'On Spot' }
  ],
  scopes: [
    { id: 'inspection-basic', name: 'Inspection' },
    { id: 'testing', name: 'Testing' }
  ],
  owners: [{ id: 'owner-offshore', name: 'OFFSHORE' }],
  allocations: [{ id: 'alloc-unallocated', name: 'Unallocated' }],
  conditions: [{ id: 'cond-good', name: 'good' }]
};

export const templatesFixture = {
  templates: [
    {
      id: 'inspection-basic',
      template_name: 'Inspection',
      works: [
        {
          subscope_id: 'visual-check',
          subscope_name: 'Visual Check',
          fields: [
            { key: 'visual-thread', label: 'Visual Thread', type: 'checkbox', selected: true,  drift_inspection: false },
            { key: 'visual-body',   label: 'Visual Body',   type: 'checkbox', selected: true,  drift_inspection: false },
            { key: 'full-length-drift', label: 'Full Length Drift', type: 'checkbox', selected: true, drift_inspection: true }
          ]
        }
      ]
    }
  ]
};

export const inspectionsListFixture = [
  { id:'INSP-1', no:'INSP-1', status:'New',            serviceType:'new-arrival', scopeId:'inspection-basic', createdAt: new Date().toISOString() },
  { id:'INSP-2', no:'INSP-2', status:'In Progress',    serviceType:'maintenance', scopeId:'refurbish',        createdAt: new Date().toISOString() },
  { id:'INSP-3', no:'INSP-3', status:'Ready to Review',serviceType:'on-spot',     scopeId:'testing',          createdAt: new Date().toISOString() },
  { id:'INSP-4', no:'INSP-4', status:'Completed',      serviceType:'new-arrival', scopeId:'inspection-basic', createdAt: new Date().toISOString() }
];