import type { INodeProperties } from 'n8n-workflow';

const showTrace = {
	resource: ['trace'],
};

const showStartTrace = {
	...showTrace,
	operation: ['start'],
};

const showEndTrace = {
	...showTrace,
	operation: ['end'],
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
				name: 'Start Trace',
				value: 'start',
				action: 'Start a trace',
				description: 'Create a new Opik trace to capture workflow execution',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/private/traces',
						returnFullResponse: true,
						body: {
							start_time: '={{$now.toISO()}}',
							name: "={{$parameter.options?.traceName || `Trace ${$now.toFormat('yyyy-LL-dd HH:mm:ss')}`}}",
							project_name: '={{$parameter.options?.projectName || undefined}}',
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
									projectName: '={{$parameter.options?.projectName || "(workspace default)"}}',
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
			{
				name: 'End Trace',
				value: 'end',
				action: 'End a trace',
				description: 'Complete an existing Opik trace with output details',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/v1/private/traces/{{$parameter.traceId}}',
						body: {
							end_time: '={{$now.toISO()}}',
						},
					},
				},
			},
		],
		default: 'start',
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
				displayName: 'Project Name or ID',
				name: 'projectName',
				type: 'options',
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getProjects',
				},
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
		displayName: 'Input',
		name: 'traceInput',
		type: 'json',
		default: '',
		description: 'JSON payload describing the trace input. Leave empty to skip.',
		displayOptions: {
			show: showStartTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'input',
			},
		},
	},
	{
		displayName: 'Metadata',
		name: 'traceMetadata',
		type: 'json',
		default: '',
		description: 'Optional metadata object to attach to the trace',
		displayOptions: {
			show: showStartTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'metadata',
			},
		},
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
	{
		displayName: 'Trace ID',
		name: 'traceId',
		type: 'string',
		required: true,
		default: '',
		description: 'Unique identifier returned by the Start Trace operation',
		displayOptions: {
			show: showEndTrace,
		},
	},
	{
		displayName: 'Output',
		name: 'traceOutput',
		type: 'json',
		default: '',
		description: 'Final output of the workflow run (JSON). Leave empty to skip.',
		displayOptions: {
			show: showEndTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'output',
			},
		},
	},
	{
		displayName: 'Additional Metadata',
		name: 'traceEndMetadata',
		type: 'json',
		default: '',
		description: 'Metadata updates to attach when completing the trace',
		displayOptions: {
			show: showEndTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'metadata',
			},
		},
	},
	{
		displayName: 'Error Message',
		name: 'traceError',
		type: 'string',
		default: '',
		description: 'Text description of any failure that occurred',
		displayOptions: {
			show: showEndTrace,
		},
		routing: {
			send: {
				type: 'body',
				property: 'error',
			},
		},
	},
];
