# Apple Spaces — Product @ TAMU 2026

> **One moment. Every device in harmony.**  
> An Apple ecosystem context layer designed to orchestrate group moments across iPhone, Apple TV, HomePod, and Apple Watch—with zero setup per device and automatic teardown.

---

## 📌 Executive Summary

College students frequently coordinate group moments (hangouts, study sessions, dorm wind-downs, and student org meetings) using fragmented, manual steps across multiple apps and devices. While current features like **Apple Invites** offer static RSVPs and shared links, they do not change how hardware responds in real time.

**Apple Spaces** introduces a live context layer that:
1. **Starts at the Planning Stage ("The Front-Door Bridge"):** Begins in an iMessage group chat with smart availability matching and an Apple Cash group tab (Piggy Bank).
2. **Orchestrates Connected Hardware:** Seamlessly transforms participating iPhones and a shared living room anchor (**Apple TV 4K** or **HomePod mini**) into a unified environmental experience without manual pairing.
3. **Guarantees Ephemeral Privacy:** Location sharing defaults to **OFF**. All temporary permissions, music queues, and guest access dissolve automatically when the space ends.
4. **Maintains Cross-Platform Inclusivity:** Android friends participate via a secure, tokenized web experience (`spaces.apple.com/join/...`) for plans, time voting, and cost splitting without feeling excluded.

---

## 🚀 Interactive Prototype

The high-fidelity **iOS 18 & tvOS 18** prototype is located in [`spaces-demo/dist`](./spaces-demo/dist):

- **Dual-Device Stage:** iPhone 16 Pro and Apple TV 4K "Party Billboard" syncing synchronously in real time.
- **Dynamic Island Integration:** Compact pill morphs with spring physics into an expandable Live Activity controller.
- **4-Screen MVP Flow (from Paper Sketches):**
  - **Screen 1 (Planning):** Create Space sheet inside Messages (`+` menu).
  - **Screen 2 (Invite Card):** Availability voting pills (`7pm`, `8pm`, `9pm`) with live consensus update (*"4 of 5 free at 8pm"*).
  - **Screen 3 (Live Space):** Who's Here roster, Apple Cash group tab (*Pizza $32 → $8 each*), collaborative queue, and privacy check-in.
  - **Screen 4 (Teardown):** Post-hangout summary with one-tap Apple Pay settlement and automated permission revocation.
- **Synthesized Apple UI Audio:** Built-in Web Audio API haptics and chimes.

### Running the Demo Locally

```bash
# Serve the static build from spaces-demo/dist
npx serve spaces-demo/dist
# or
python -m http.server 8080 --directory spaces-demo/dist
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📂 Repository Structure & Sprint Deliverables

| File / Directory | Description |
| :--- | :--- |
| [`MVP + Prioritization Matrix Deliverable.pdf`](./MVP%20+%20Prioritization%20Matrix%20Deliverable.pdf) | Formal MVP charter, prioritization matrix, user flows, storyboards, and paper sketches. |
| [`spaces-demo/`](./spaces-demo) | Interactive web prototype built to Apple Human Interface Guidelines. |
| [`improvements.md`](./improvements.md) | Scope refinement, "Hangout Space" wedge strategy, competitive moat vs Apple Invites, and revenue framing. |
| [`research_and-user_persona.md`](./research_and-user_persona.md) | Survey findings, user personas (*Maya - Social Coordinator* and *Jordan - Lowkey Joiner*), and journey maps. |
| [`apple-spaces-spec.md`](./apple-spaces-spec.md) | Initial core product specification, space models, and lifecycle. |
| [`kickoff_and_scoping.md`](./kickoff_and_scoping.md) | Initial kickoff problem statement, stakeholder map, and risks. |
| [`brainstorming.md`](./brainstorming.md) | Sprint 1 brainstorms and early concept ideation. |

---

## 👥 Project Team (Product @ TAMU)

- **Patrick Semler**
- **Benjamin Aleman**
- **Bhuvan Taliyakula**
- **Diya Raj**
- **Liam West**
