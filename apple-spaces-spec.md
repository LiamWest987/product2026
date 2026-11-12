# Apple Spaces

## Summary

Spaces is a context layer that lets a person's Apple devices respond together to a place, activity, routine, or moment. A Space can be personal, such as a study session, or shared temporarily with invited people. Instead of configuring each device and app separately, the person chooses or confirms a context and the ecosystem coordinates the relevant behaviors.

**Product promise:** Your devices already learn your habits individually. Spaces lets them work together around the moments that matter to you.

## Problem

People repeatedly set up the same combinations of Focus modes, apps, audio, navigation, and sharing across their devices. Location-only automations are often too blunt: being in a dorm room in the afternoon should not trigger bedtime, and arriving at a building does not explain which entrance or room to use. Group activities add more setup: people need to find one another, share files, coordinate music, and decide what to keep afterward.

## Product principles

- **A Space is a state, not a pile of automations.** Participating Apple features and opted-in apps can respond to the same context.
- **Personal context stays personal.** A shared Space can coordinate group behavior without revealing an individual's private habits or preferences.
- **Suggestions earn trust.** Spaces can notice repeated patterns and suggest an automation, but do not silently turn a guess into a new behavior.
- **The person stays in control.** Show what will happen, who can participate, and when access ends. Make pausing, editing, and leaving easy.
- **Temporary access expires.** Group permissions end when the Space ends or a participant leaves, unless people explicitly choose to save or continue something.
- **Useful without a group.** A Space can coordinate one person's own devices; inviting others is optional.

## Space model

A Space combines four kinds of context:

1. **Personal:** the person's selected routines, preferences, and device setup.
2. **Environmental:** a place, nearby devices, available Home accessories, or a destination.
3. **Social (optional):** invited people who choose to join.
4. **Temporal:** a schedule, expected duration, or condition that ends the Space.

The person can create a Space explicitly or accept a suggestion based on a repeated combination of signals, such as arriving at a place, opening the same apps, connecting AirPods, and enabling Focus on a recurring schedule. Inferences should be presented as suggestions with a clear preview and a “Not Now” option.

## Lifecycle

### Before

The person starts a Space, schedules it, or accepts a suggestion. Siri may recognize an upcoming plan and offer to prepare a relevant Space. The setup screen summarizes the name, time, location, participating devices, actions, and any invitees.

### Arrive / activate

Arrival or an explicit action activates the Space. Location can be combined with time, device state, and user confirmation to avoid false triggers. The user receives a concise prompt when confirmation is needed.

### During

Participating devices and apps respond to the active context. Examples include Focus behavior, app/workspace suggestions, audio, Home scenes, Maps guidance, nearby sharing, or controls for a shared display. Each action can be edited or disabled independently.

### Leave / end

The Space ends at its chosen time, when its owner ends it, or when its condition is met. Temporary group access and device behaviors are removed. A person leaving a group Space stops contributing to shared controls and permissions.

### Remember

Afterward, Spaces can offer to preserve things people may want: a playlist, selected photos in a shared album, or a conversation people choose to keep. Nothing personal is collected into a shared archive by default. A recurring Space can be saved for next time; otherwise it can expire.

## Example experiences

### Personal study session

The user starts “Physics Lecture” on their iPhone or Mac. Their Mac opens the course workspace, their devices enable the chosen Focus, and their Watch provides class or campus navigation when needed. The Space works even if no one else joins.

### Dorm wind-down

At a usual bedtime, a combination of time, Watch activity, device state, and the user's calendar can suggest the dorm wind-down Space. Once approved or started, it can set Sleep Focus, dim a Home scene, lower Apple TV volume, and confirm the next alarm. Simply being at the dorm does not trigger it.

### Party with friends

The host prepares a temporary Space with a start time and destination. Invitees see what joining enables, such as a collaborative music queue, temporary chat, or shared controls. On arrival, Maps can guide them to the building. When the Space ends, participants can choose whether to save photos or the playlist; temporary access expires.

### Club meeting room

Members who opt in can join a meeting Space. Shared files and links, the relevant group conversation, and presentation controls become available for the meeting. Personal app choices remain private. The club can save the Space as a recurring setup.

### Learned indoor arrival

With permission, a personal Space can learn a frequently used route through a building (for example, entrance, floor, and hallway). The owner reviews and chooses whether to share that route with an invitee. A guest receives the route for this visit, not the owner's movement history. Indoor guidance must indicate when a route is approximate and provide a manual fallback.

## Feature opportunities

- Focus and notification behavior across iPhone, iPad, Mac, and Watch.
- App and workspace suggestions based on an active personal Space.
- Apple Music, AirPods, Apple TV, Home, and CarPlay coordination.
- Temporary collaboration such as shared queues, files, controls, chat, or photo collections.
- Context-aware destination and indoor arrival guidance, where supported.
- Developer hooks that expose the active Space and its approved capabilities without exposing unrelated personal context.

## Controls and privacy

- Spaces can be started manually; automation is optional.
- Show the triggering context and a preview of actions before activation when behavior is new or consequential.
- Provide per-device and per-action controls, a visible active state, and a one-step pause/end control.
- Ask separately before sharing location, an indoor route, identity, files, photos, or controls with other people.
- Show who joined and what each participant can access.
- Expire temporary permissions on leave/end and provide a clear post-session save choice.
- Keep routine learning on-device where possible; let users inspect, edit, or delete learned patterns.
- Avoid inferring sensitive states or exposing private routines through shared suggestions.

## MVP

Start with personal Spaces across Apple devices: explicit creation, manual activation, named actions for Focus and app/device setup, optional time or place triggers, and clear previews and controls. Add suggestions from repeated patterns only after the user can inspect and approve them. Then test a small set of temporary shared capabilities, such as a collaborative music queue and meeting file sharing, with explicit invitations and automatic expiry.

## Open questions

- What is the simplest system-wide surface for creating and seeing an active Space?
- Which actions can third-party apps request, and how does the user approve each capability?
- How should Spaces behave when devices are offline, shared, or unavailable?
- What confidence and fallback are required before offering indoor directions?
- How should a personal Space interact with an existing Focus, Shortcut, or Home automation?
- Which post-session items are worth suggesting, and how can those prompts stay unobtrusive?

## Measures of success

- People can start and understand a useful personal Space without inviting anyone.
- Fewer repetitive setup steps across a person's devices.
- High acceptance and continued use of user-approved suggestions, with low rates of accidental activation and immediate undo.
- Users can accurately explain what a Space shares and when that access ends.
- Shared sessions result in fewer manual coordination steps without unwanted persistence afterward.
