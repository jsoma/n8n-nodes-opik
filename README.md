# n8n-nodes-opik

This community node lets you connect [Comet Opik](https://www.comet.com/opik/) with your n8n workflows.

Opik is Comet’s open-source observability and evaluation platform for LLM- and agent-powered systems. It provides trace/span logging, prompt management, guardrails, and human/automatic feedback collection so you can understand and improve AI workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The node exposes these Opik capabilities:

- **Trace** – start a trace with rich input metadata and end it with output/error details.
- **Span** – log nested spans (LLM/tool/agent/general) including token usage, metadata, and tags.
- **Prompt** – fetch any prompt or a specific version from the Opik prompt library.
- **Guardrail** – run PII detection or topic moderation checks and receive violations/redacted text.
- **Feedback** – log numeric feedback for traces or spans (accuracy, relevance, quality, etc.).

## Credentials

Install the package:

```bash
npm install @jsoma/n8n-nodes-opik
```

Then create an **Opik API** credential with:

- **API URL** – Defaults to `https://www.comet.com/opik/api`. Point this to your self-hosted base URL if needed (must include the `/api` suffix).
- **API Key** – Required for Opik Cloud. You can generate one from the Opik UI (Settings → API Keys). Leave blank only if your self-hosted deployment allows anonymous requests.
- **Workspace Name** – Optional default workspace/project namespace so you don’t have to pass `project_name` in every trace call.

The credential tester pings `/v1/health` to verify connectivity before you run workflows.

## Compatibility

- Requires n8n `1.60.0` or later (declarative HTTP nodes & `n8n-node` CLI).
- Tested locally with Node 18 and n8n `1.60` dev server.

## Usage

1. Install the package following the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).
2. Add your **Opik API** credentials.
3. Drop the **Opik** node into a workflow and choose the resource/operation you need. Each operation surfaces the most common request parameters (JSON inputs, metadata, tags, token counts, etc.).
4. Chain multiple operations together when you want full observability (Start Trace → Log Spans → Check Guardrails → Log Feedback → End Trace).

Every operation returns the raw Opik API response so you can inspect IDs, metadata, or guardrail violations in downstream nodes.

## Resources

- [Opik product docs](https://www.comet.com/docs/opik/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## Version history

- `0.1.0` – Initial release with trace, span, prompt, guardrail, and feedback operations.
