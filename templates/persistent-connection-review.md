# Persistent-connection security and recovery review

<!-- REQUIRED: Complete for WebSocket, Socket.IO, WebRTC signalling, server-sent events, or another long-lived channel. -->

| Area | Required decision and evidence |
| --- | --- |
| Transport | WSS or current TLS configuration, certificate validation, downgrade rejection, mixed-content behavior: <!-- REQUIRED --> |
| Handshake | Authentication, expected Origin validation where applicable, environment/account binding, credential transport: <!-- REQUIRED --> |
| Authorization | Server authorization for every room, topic, object, tenant, and sensitive action: <!-- REQUIRED --> |
| Messages | Allow-listed types and fields, size, format, sequence, ownership, output encoding, unknown-operation rejection: <!-- REQUIRED --> |
| Capacity | Upgrade rate, concurrent connections, subscriptions, message rate, payload size, queue, fan-out, and account/IP/device limits: <!-- REQUIRED --> |
| Backpressure | Bounded queue and send buffer, slow-consumer policy, degradation and disconnection thresholds: <!-- REQUIRED --> |
| Lifetime | Idle timeout, heartbeat, token refresh or expiry, revocation, logout, and graceful server shutdown: <!-- REQUIRED --> |
| Reconnect | Jittered backoff, retry bound, reauthorization, snapshot and sequence reconciliation, duplicate suppression: <!-- REQUIRED --> |
| Privacy-safe observability | Connection, authorization, throttle, drop, and protocol-error events; redaction and retention: <!-- REQUIRED --> |

## WebRTC signalling and media

- Offer, answer, and ICE schema, size, frequency, ownership, and room authorization: <!-- REQUIRED -->
- Short-lived scoped TURN credentials, quotas, allocation monitoring, and abuse response: <!-- REQUIRED -->
- SDP and ICE minimization, log/analytics restriction, retention, and support-data handling: <!-- REQUIRED -->
- Recording consent, moderation, endpoint compromise, metadata privacy, and encryption boundaries: <!-- REQUIRED -->
- Honest reconnecting, degraded, failed, and recovered UX: <!-- REQUIRED -->

## Negative and resilience tests

- Unauthorized subscription and cross-tenant action: <!-- REQUIRED -->
- Malformed, oversized, replayed, duplicated, and out-of-order message: <!-- REQUIRED -->
- Connection flood, slow consumer, queue saturation, and expensive fan-out: <!-- REQUIRED -->
- Token expiry, revocation, server restart, network drop, and state reconciliation: <!-- REQUIRED -->

