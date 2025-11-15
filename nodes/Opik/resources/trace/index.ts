import type { INodeProperties } from 'n8n-workflow';

const showTrace = {
	resource: ['trace'],
};

const showStartTrace = {
	...showTrace,
	operation: ['start'],
};

export const traceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showTrace,
		},
		options: [
			{
				name: 'Create Trace',
				value: 'start',
				action: 'Create a trace',
				description: 'Create a new Opik trace to capture workflow execution',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/private/traces',
						returnFullResponse: true,
						body: {
							start_time: '={{$now.toISO()}}',
							name: "={{$parameter.options?.traceName || `Trace ${$now.toFormat('yyyy-LL-dd HH:mm:ss')}`}}",
							project_name: '={{$parameter.projectName}}',
							thread_id: '={{$parameter.options?.threadId || undefined}}',
							end_time: '={{$parameter.options?.autoEndTrace ? $now.toISO() : undefined}}',
						},
					},
					output: {
						postReceive: [
							{
								type: 'setKeyValue',
								properties: {
									traceId:
										'={{$response.headers?.location ? $response.headers.location.split("/").pop() : undefined}}',
									traceName:
										"={{$parameter.options?.traceName || `Trace ${$now.toFormat('yyyy-LL-dd HH:mm:ss')}`}}",
									projectName: '={{$parameter.projectName}}',
									threadId: '={{$parameter.options?.threadId || undefined}}',
									traceUrl: '={{$response.headers?.location || undefined}}',
									status: '={{$parameter.options?.autoEndTrace ? "ended" : "started"}}',
									autoEnded: '={{$parameter.options?.autoEndTrace === true}}',
								},
							},
						],
					},
				},
			},
		],
		default: 'start',
	},
	{
		displayName: 'Input',
		name: 'traceInputAssignments',
		type: 'assignmentCollection',
		placeholder: 'Add input entry',
		default: {},
		displayOptions: {
			show: showStartTrace,
		},
	},
	{
		displayName: 'Resolved Input',
		name: 'traceInput',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: showStartTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'input',
				value:
					'={{(() => { const assignments = $parameter.traceInputAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Metadata',
		name: 'traceMetadataAssignments',
		type: 'assignmentCollection',
		placeholder: 'Add metadata entry',
		default: {},
		displayOptions: {
			show: showStartTrace,
		},
	},
	{
		displayName: 'Resolved Metadata',
		name: 'traceMetadata',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: showStartTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'metadata',
				value:
					'={{(() => { const assignments = $parameter.traceMetadataAssignments?.assignments || []; if (!assignments.length) { return undefined; } const obj = {}; for (const assignment of assignments) { if (assignment.name) { obj[assignment.name] = assignment.value; } } return Object.keys(obj).length ? obj : undefined; })()}}',
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {
			autoEndTrace: false,
		},
		displayOptions: {
			show: showStartTrace,
		},
		options: [
			{
				displayName: 'Trace Name',
				name: 'traceName',
				type: 'string',
				default: '',
				description:
					'Override the auto-generated trace label (defaults to a timestamp if left empty)',
			},
			{
				displayName: 'Thread ID',
				name: 'threadId',
				type: 'string',
				default: '',
				description: 'Use the same thread ID to group related traces',
			},
			{
				displayName: 'Auto End Trace',
				name: 'autoEndTrace',
				type: 'boolean',
				default: false,
				description: 'Whether to immediately mark the trace as completed after creation',
			},
		],
	},
	{
		displayName: 'Tags',
		name: 'traceTags',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		description: 'Tag the trace for easier filtering in Opik',
		displayOptions: {
			show: showStartTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'tags',
			},
		},
	},
];
