import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Mem0Api implements ICredentialType {
	name = 'mem0Api';
	displayName = 'Mem0 API';
	icon = { light: 'file:mem0.svg', dark: 'file:mem0.dark.svg' } as const;
	documentationUrl = 'https://docs.mem0.ai';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key from your Mem0 platform dashboard (e.g. m0-...)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.apiKey.trim().startsWith("Token ") ? $credentials.apiKey.trim() : "Token " + $credentials.apiKey.trim().replace(/^[\"\']|[\"\']$/g, "")}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.mem0.ai',
			url: '/v1/memories/',
			method: 'GET',
			qs: {
				user_id: 'default',
				page_size: 1,
			},
		},
	};
}
