import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { traceDescription } from './resources/trace';
import { spanDescription } from './resources/span';
import { promptDescription } from './resources/prompt';
import { guardrailDescription } from './resources/guardrail';
import { feedbackDescription } from './resources/feedback';
import { getPrompts, getPromptVersions, getProjects, getPromptText } from './methods/loadOptions';

export class Opik implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Opik',
		name: 'opik',
		icon: { light: 'file:opik.svg', dark: 'file:opik.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Interact with the Opik API',
		defaults: {
			name: 'Opik',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'opikApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Feedback', value: 'feedback' },
					{ name: 'Guardrail', value: 'guardrail' },
					{ name: 'Prompt', value: 'prompt' },
					{ name: 'Span', value: 'span' },
					{ name: 'Trace', value: 'trace' },
				],
				default: 'trace',
			},
			...traceDescription,
			...spanDescription,
			...promptDescription,
			...guardrailDescription,
			...feedbackDescription,
		],
	};

	methods = {
		loadOptions: {
			getPrompts,
			getPromptVersions,
			getProjects,
			getPromptText,
		},
	};
}
