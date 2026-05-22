---
slug: /2026-05-22-cross-team-agent-reviews
canonical_url: https://dfberry.github.io/blog/2026-05-22-cross-team-agent-reviews
custom_edit_url: null
sidebar_label: "2026.05.22 Cross-Team Agent Reviews"
title: "When Someone Else's Agent Reviews Your PR"
description: "Your PR lands with a team whose standards you don't fully know. Their agent reviews it with full reasoning attached. Here's what I've learned about receiving reviews from agents I didn't configure — and why the standards transfer is the part most people miss."
draft: true
tags:
  - AI Agents
  - Code Review
  - Developer Experience
  - GitHub Copilot
  - AI assisted
updated: 2026-05-22 08:35 PST
keywords:
  - cross-team agent reviews
  - ai code review
  - pr review standards transfer
  - team standards visibility
  - agentic pr review
  - code review feedback loop
  - sme review problem
  - documentation standards
---

# When Someone Else's Agent Reviews Your PR

<!-- IMAGE PROMPT: Watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork. Two figures in separate pools of warm lamplight, each at a different wooden desk — one in a Pacific Northwest cabin, one in a modern studio. Between them, a single glowing thread or paper note floats in the space, carrying handwritten text. The feeling is of standards being transmitted across distance without friction. Soft greens and ambers. -->
![Two developers in separate spaces connected by a floating review note — standards transmitted across team boundaries](./media/2026-05-22-cross-team-agent-reviews/cross-team-standards-transfer.png)

*When the review is professional by default, the standard travels cleanly. No relationship required. No bandwidth negotiation. Just the rule, with the reasoning.*

My PR went to the platform team for a standards review. Their agent came back with 6 comments. Five were naming and formatting patterns I'd been violating across multiple previous PRs — all of which had gotten approved silently. The sixth was a cross-namespace naming convention that doesn't exist in any onboarding documentation, because the platform team built it over three years of working conversations and never formalized it.

I fixed all six flags. Took about twenty minutes. I added the rules to my reviewer notes for that content area. My next PR to that team had zero flags on those patterns.

"LGTM" from a subject matter expert across team boundaries is the worst possible outcome — not the neutral one. They reviewed it. They know things I don't. The knowledge doesn't travel.

When their agent reviews your PR, the knowledge travels with the verdict.

This is about the other direction of agent-assisted review: not your own agents reviewing your own work, but someone else's agent reviewing your PR when it crosses into their content area. The feedback loop is the same, but what you're learning is different — you're not refining standards you helped develop, you're getting your first clear view of standards that have been operating invisibly.

---

## Why "LGTM" From an SME Is Worst When You're the Outsider

Within your own team, a "LGTM" approval has context that makes it at least partially interpretable. You know roughly what the reviewer cares about. You have a read on whether they're signaling "this is genuinely fine" or "I skimmed it and it looked okay" or "I don't have bandwidth right now but I trust you." You can ask a clarifying question without much overhead. The relationship absorbs the ambiguity.

Cross-team, that context disappears entirely. You're submitting to a team whose priorities and internal standards you don't fully know. When they approve with "LGTM," you can't distinguish three meaningfully different outcomes: "this meets our standards fully," "this doesn't meet our standards but nothing is bad enough to block on," or "I didn't have time to check the things that actually matter." The approval looks identical for all three.

The result is that you keep making the same mistakes across consecutive PRs, because you never find out they're mistakes. You keep using "server name" in parameter tables when the convention is "resource name." You keep including ambient-context parameters in tool parameter tables when the convention is to omit them. You keep using the language slug from an older article that predates the current convention. The patterns go through on every PR that gets a rushed review. Occasionally one lands with a reviewer who has time and inclination to flag it. You fix that instance. You move on without knowing whether you've learned the rule or just fixed the exception.

The less visible failure mode: "LGTM" from a cross-team SME is uniquely frustrating because you can't even calibrate what it means. Within your own team, you might know this reviewer well enough to know they always check the API surface but skim prose clarity. You compensate. With a cross-team expert you interact with twice a year, you don't have that read. Their "LGTM" is a black box.

The other failure at cross-team scale is the pointed correction without context. The reviewer is clearly annoyed that you've violated a convention they consider obvious, and they tell you. "This should be `resource name`, not `server name`." The correction is right. The delivery is terse. The context is absent. You fix the instance. You spend ten minutes wondering whether this is a team-wide convention or one person's strong preference. You decide not to ask because they seem busy and you don't want to be the person who needs hand-holding. Next PR: "server name" again, different file, different article. The conversation repeats.

Repeat the exchange three times and neither side is learning anything. The reviewer is mildly exasperated. The contributor is mildly confused. The standard still lives only in one person's head.

What actually helps is a reviewer who applies the same standards consistently, explains the reasoning when they flag something, and distinguishes between "this violates a documented convention" and "I have a question about your intent here." That's not a high bar. It's also not something you can reliably get from a cross-team reviewer who is managing their own deliverables and treating your PR as a secondary obligation.

An agent from their team applies their documented standards to every PR, with the reasoning attached, regardless of queue length or workload.

---

## What Their Agent Actually Said

The PR in question was a documentation update covering a set of platform tools. I was adding parameter tables to three articles that covered resources across the compute, storage, and database namespaces. I based the table format on older articles in the series I'd found in the repo. Three of those older articles used "server name" in the parameter description column for resource identifier parameters. I followed that pattern — it was the evidence I had.

Here's what the platform team's agent returned:

> **Platform Reviewer — Standards Check**
>
> Parameter table uses "server name" in the Description column for `server_name` parameter in `compute_vm_start`, `compute_vm_stop`, and `db_server_list`. The convention in this content area is "resource name" for all resource identifiers, consistent with the compute and storage namespace articles. See: `storage_account_list`, `vm_list`.
>
> This inconsistency will create problems for readers switching between namespaces and may conflict with automated tooling that normalizes on "resource name."

Four things in that review comment that a "LGTM" never gives me:

**The rule, stated explicitly.** Not "change server name to resource name." The convention exists across the entire content area for all resource identifiers. Scope: all of them.

**The comparison points.** `storage_account_list`, `vm_list`. I can go look at those articles right now and see exactly what correct looks like. I'm not making assumptions about what the reviewer means or has to look up.

**The reason.** Two reasons, actually: readers switching namespaces, and automated tooling normalization. Now I understand why the rule exists. That matters because it tells me when the rule applies and when an exception might be warranted. If I'm documenting a resource type that is literally and only a server — not a general namespace resource — I know whether "server name" might be justified or whether the convention overrides the specificity.

**The scope.** "This content area" — not just this article, not just this PR. A rule I carry forward to every subsequent submission to this space.

Those are four things I now know that I didn't know before the review. I added all four to my reviewer notes for the platform content area. My next three PRs to that team had zero "resource name" flags. Not because the agent changed — it was running the same check. Because I learned the rule.

The older articles I'd based my work on — the ones using "server name" — were pre-convention, written before the platform team formalized the approach. They'd never been updated because the team hadn't had bandwidth to do a full sweep. My PR was perpetuating an outdated pattern without knowing it. A human reviewer looking at my PR while managing four others in their queue might have noticed the discrepancy but not had time to write out the full reasoning, or might have recognized the pre-convention articles as the source and not flagged it, not knowing I'd copied the old pattern thinking it was current.

The agent checks the current standard against the current PR, every time, with the reasoning attached. The pre-convention articles don't confuse it.

---

## Team Standards Don't Come With Documentation

Every team with more than six months of active work has accumulated standards that aren't formally documented. Not out of negligence — most conventions don't start as policy statements. They start as decisions made in the flow of normal work.

The platform team decided at some point that "resource name" was better than "server name" for resource identifier descriptions. That decision almost certainly happened in a PR comment or a quick conversation, not in a standards meeting. The person who made the call had a reason. The people in the thread carried the reasoning. Future articles got reviewed by those people, who applied the standard. The pattern spread through the content area via review rather than via documentation. It became real — consistently applied, consistently correct — without ever being written down as a rule.

Six months later, someone from outside the platform team's daily orbit submits a cross-team PR. They base their work on articles that exist in the repo, including the pre-convention ones that haven't been updated. They use "server name." Their PR gets reviewed by someone who knows the convention but is behind on their own work. The review is "LGTM" or a terse one-liner. The contributor makes the change (if told to) without understanding the rule. The next PR from that contributor has the same issue.

This is how standards fail to transmit across team boundaries. It's not anyone's fault. The expert who reviewed is operating rationally given their constraints. The contributor who made the mistake was following the evidence available to them. The system just doesn't have a good mechanism for getting the expert's contextual knowledge into the contributor's hands at the moment they need it.

The agent is that mechanism.

When the platform team configures their reviewer with the resource naming convention — rule, comparison points, reason — that knowledge is available at every cross-team PR review, regardless of whether the expert who created the convention is available. It doesn't require the expert's bandwidth. It doesn't require a relationship between the contributor and the team. It requires that someone put the standard into the reviewer notes once.

This changes the cross-team knowledge transfer problem from "how do we get the expert's knowledge to the contributor in time" to "how do we get the expert's knowledge into the agent's configuration once." The second problem is easier. It happens once, when the standard is established or articulated, rather than repeatedly, for every cross-team contributor who encounters it.

There's a secondary benefit that the platform team gets, separate from the cross-team contributors: building the agent configuration forces explicit articulation of standards that were previously tacit. When you have to write "resource name for all resource identifiers, consistent across compute and storage namespaces, required for automated tooling normalization," you're making a rule more precise than it was when it lived in people's heads as "we just say resource name." Some of those standards, when written out, turned out to be underdocumented even in the reviewer notes — "Required/Optional per CLI JSON schema, not per usage observation" needed more specification before it was reliable enough to configure the agent on. The process of articulating standards makes them more useful for the team itself, not just for incoming contributors.

I've been on both sides of this. Submitting cross-team PRs where I got terse corrections I didn't understand, fixing the instance without learning the rule. Reviewing cross-team PRs myself where I had the contextual knowledge but not the time to write out the full reasoning, leaving a one-liner that the contributor probably filed under "that person's preference" rather than "team convention." Both sides rational given the constraints. Both sides producing an exchange that transfers nothing durable.

The agent on the reviewing side changes the default.

---

## How the Feedback Loop Works Cross-Team

The first PR I submit to a team whose standards I don't know: their agent flags several things, all specific, all with reasoning. I fix the flags. The part that compounds over time is what I do with those flags after fixing them.

For each flag I get, I write the underlying rule into the reviewer notes section of my PR description template for that content area. Not a mental note — an actual written rule, so the next PR starts from it.

The format I use in the reviewer notes:

> **[rule type]:** [rule statement, including scope]. See: [comparison point]. Reason: [why].

After the first PR to the platform team:
> **Resource identifiers:** Use "resource name" for all resource identifier descriptions in parameter tables across compute, storage, and database namespaces. See `storage_account_list`, `vm_list`. Reason: cross-namespace consistency and automated tooling normalization.

After the second PR:
> **Required/Optional status:** Match the CLI JSON schema value exactly. Do not inherit Required/Optional status from similar tools in adjacent namespaces — check the schema directly for each tool. See PR #[number] for the subscription parameter pattern. Reason: schema is the source of truth; adjacent patterns can diverge without announcement.

After the third PR:
> **Example section URLs:** Use published production service endpoint URLs. Development environment URLs don't belong in examples regardless of whether they're technically accurate. See the published compute namespace articles for format. Reason: examples document the public API, not internal infrastructure.

By the fourth PR, the flags from the first three don't fire. The agent is still running the same checks — those standards are part of their configuration regardless of who submits. But those specific patterns are now in my baseline for this content area. I'm a different contributor than I was at PR 1. I bring documented knowledge of their standards into each PR rather than starting from zero context.

The front-loading is steeper cross-team than within your own workflow. You have more to learn, and you're starting from zero familiarity with the area rather than from working alongside the people who built the standards. But the compounding effect is identical.

The limit: the loop is bounded by what's in the agent's configuration. If the platform team updated a convention between my last PR and my current one, their agent reflects the new standard. My notes have the old rule. The agent flags it on my next PR. I update the notes. The correction mechanism is reactive — flagging when I violate the new standard — not proactive notification. For content areas where I submit infrequently, I do a manual check on my reviewer notes against their most recent flag summary before submitting, to see if anything obviously changed.

This doesn't scale perfectly past about three teams with active reviewer configurations. Four teams means four sets of reviewer notes to maintain, and the manual convention-change checks across four areas are about 45 minutes of overhead per sprint. That's still worth it to me — the alternative is making the same convention mistakes repeatedly across all four teams — but it's a real cost that scales linearly with how many cross-team areas you're working in.

---

## No Relationship Required

Cross-team review at scale has a structural relationship problem. Getting quality feedback from a team you don't work with daily requires one of: a pre-existing relationship where someone prioritizes your PR, a formal assignment process where review responsibility is explicit, or good timing. Most of the time, cross-team PRs get "LGTM" or a terse one-liner because the reviewer doesn't have bandwidth to go deeper on work they didn't create and aren't accountable for.

When the team runs agent reviews, that structural problem doesn't disappear — but its impact on any individual PR shrinks substantially. The agent applies their documented standards at full depth regardless of whether there's a relationship between the reviewer and the contributor. It doesn't take more time for a first-time cross-team contributor than for someone who's submitted a hundred PRs to that content area. The standards get applied the same way every time.

This matters most for contributors who are new to a content area — who don't know the conventions, who are making the first-few-PR mistakes that everyone makes. Those contributors are exactly the ones least likely to have a relationship that unlocks a thorough review. The agent inverts that: the thoroughness of the review doesn't scale with the contributor's relationship capital on that team.

<!-- IMAGE PROMPT: Watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork. The pink-haired girl sits cross-legged on a park bench in a lush Pacific Northwest garden, reading a clipboard of organized review notes. Her expression is calm and focused. Around her, other figures at desks show contrasting emotions — frustration, typing forcefully, crumpled papers. The pink-haired girl's space is serene, illuminated by diffuse green light through cedar branches. -->
![The pink-haired developer reading review feedback calmly in a serene PNW garden while others show review frustration](./media/2026-05-22-cross-team-agent-reviews/psychological-safety-review.png)

*When feedback is professional by default, you can engage with the content rather than managing the relationship.*

The professional-by-default aspect matters more cross-team than it does within your own workflow. Inside your own team, delivery problems in review comments come with relationship context you can use to separate the signal from the noise. You know this reviewer is generally terse but accurate. You know they've been heads-down on a release and their threshold for patience is low right now. Cross-team, that context doesn't exist. A terse or pointed comment from a team you don't know well is just terse and pointed. You can't easily check whether "this is incorrect" means "this violates a specific documented standard" or "I'm behind and phrasing things badly."

An agent doesn't have that variance. It doesn't have good days and bad days. When the platform team's agent says "resource name, not server name, per the content area convention," the tone is identical whether I'm a first-time cross-team contributor or their closest collaborator. I read the flag at face value. The only question is whether it's right. If yes, fix it. If I think there's a legitimate exception, I explain in a reply. That's the whole exchange.

There's an additional thing agents do in ambiguous cases that changes the review dynamic: they ask rather than assert.

A human reviewer under time pressure hitting something uncertain has limited options — mark it wrong, approve with a mental note, or leave a vague comment that implies a problem without stating one. All rational given their constraints. None of them give the author a useful signal about what's actually expected.

The platform team's agent on a PR I submitted recently:

> The tool description for `compute_vm_start` uses "initiate a virtual machine start operation" where the upstream source text says "start a virtual machine."
>
> "Initiate a start operation" is more complex than the source without being more precise in the standard case — but this may be intentional if there's a distinction between initiating and completing the operation in the async context. Is this a deliberate clarification or drift from source text?

That's a question, not a verdict. I can answer it: yes, intentional, the async distinction matters for readers trying to understand the return value. Or: no, drift, reverting to source text. Either way I understand exactly what the reviewer is checking and why. The exchange closes cleanly.

The human version of this review would often skip the question. A reviewer with a full queue might approve (the description isn't wrong, just different) or leave "per source text" — which tells me the result without the reason. I'd make the change and still not know what made the distinction matter.

For documentation work where many of the interesting calls are genuinely ambiguous — is this variation acceptable or a convention violation? — getting questions is valuable because it surfaces the exact edge case that the standard needs to cover. When I explain that the async distinction justifies the more complex phrasing, and the reviewer confirms it, that exception is now documented in the PR exchange. The next contributor who hits the same case has a precedent to point to.

---

## The Audit Record Matters More When You Can't Ask

When I've configured my own Squad agents to review my PRs, there's a recovery path when something in the review record is unclear: I can reconstruct context. I know what each agent was configured to check. I can look at the reviewer notes that drove a flag. If a question comes up six months later about why something was decided, I can go back to the configuration and understand the reasoning chain.

With a cross-team agent review, that recovery path doesn't exist. I don't have access to the platform team's reviewer configuration. I can't query their agent about why a particular standard was established. The PR review record — the actual exchange preserved in the PR — is the only permanent record I have of what their standards were at that moment.

That makes the captured reasoning more important, not less.

<!-- IMAGE PROMPT: Watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork. The pink-haired girl standing in front of a glowing glass display case, like a museum exhibit. Inside the case, a PR review card is preserved and illuminated, surrounded by artifacts: a code snippet, a decision note, a timestamp. The light is amber and warm, like a fire or late afternoon sun. Outside the display case window, a winter scene — bare trees, snow on the Cascades in the distance. The feeling is of preservation and permanence. -->
![The pink-haired developer viewing a preserved PR review in a museum-style display case, with winter Cascades in the distance](./media/2026-05-22-cross-team-agent-reviews/captured-in-perpetuity.png)

*A year later, the PR is still there. The reasoning is still there. The "why" — the hardest thing to recover — is captured in the record.*

Here's the scenario. Eight months from now, someone is looking at an article I submitted to the platform team's content area. They notice the parameter tables use "resource name" consistently and are wondering whether I knew that was a convention or happened to get it right. The PR the platform team's agent reviewed is still there. The agent's comment explains the convention, the comparison points, the reason. The exchange shows I fixed the flags and added the rule to my notes. It's clear I learned the standard.

More commonly: I'm the one looking at an article I wrote eight months ago, trying to remember the platform team's exact standard for Optional parameters in cross-namespace tools. I don't have the reviewer notes from eight months ago in front of me — I may have updated my template since then. I go back to the PR. The agent's flags are there, the reasoning is there, the exchange is preserved. Reoriented in thirty seconds.

This is the practical difference between a review record and a review memory. The memory fades. "We talked about the resource naming thing at some point" is not the same as the exchange that explains what the convention is, why it exists, and what it was compared against. The record doesn't fade.

The before/after is stark. **Before:** I'm looking at a parameter table I wrote eight months ago. It mixes "resource name" and "server name" across different rows. I don't know if this was intentional or a convention violation or an editorial call I made in the moment. The PR history says "LGTM." I have nothing. I'm making a judgment call about which pattern to follow with no basis for the decision.

**After:** I go to the PR. The agent's comment says "resource name per content area convention, see `storage_account_list`, reason: cross-namespace consistency and tooling normalization." My reply confirms I understood and implemented it. If the table mixes conventions, I know which one is correct. I can fix the inconsistency rather than making another undocumented judgment call.

That's not a small difference. It's the difference between archaeological guesswork and having an actual record.

<!-- IMAGE PROMPT: Watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork. A wide, peaceful view of the Nooksack River valley at dusk, with the Cascade foothills in the background. In the foreground, the pink-haired girl stands at the water's edge holding a glowing lantern. The water reflects both the lantern light and the last of the sunset. Carved into a nearby wooden post is a small plaque with a date and a few words — the feeling of something marked, preserved, permanent. The mood is contemplative and warm. -->
![The pink-haired developer at the Nooksack River at dusk, holding a lantern beside a marked post — a feeling of something preserved](./media/2026-05-22-cross-team-agent-reviews/nooksack-preserved-reasoning.png)

*The reasoning, once captured, doesn't drift. It stays exactly where you left it — a marker in the record that future you will actually be able to read.*

Code comments go stale. Architecture diagrams drift — a diagram from eighteen months ago describes three services; the system now has seven. PR reasoning doesn't drift. A PR from eight months ago that says "this naming convention was intentional, here's why, here's what it was compared against" is useful even if the convention has since changed, because it tells you the decision was deliberate, when it was made, and what information was in scope at the time. You need that to understand whether the current state is a refinement of the original decision or a divergence from it.

For cross-team work specifically, this matters because you can't always Slack the reviewer from eight months ago and ask "what were you checking when you approved this?" The expert who reviewed it might have moved to a different team. The person who "LGTM'd" it might not remember the context. The agent's review is the record. When the reasoning is explicit in the record, the record is usable. When it's not, you're doing archaeology.

---

## Write the PR to Actually Be Reviewed

Knowing that a team runs agent reviews changes how you write the PR description before submitting. Not because you need to satisfy the agent — it will run its checks regardless of what you write. Because what makes an agent review useful is the same as what makes a human review useful: clear scope, stated source of truth, explicit questions where you're genuinely uncertain.

When I'm submitting to a team with agent reviews, my PR description for that content area includes:

**Goal:** what this PR covers, which source material it's based on, which target format it's following.

**Source of truth:** a specific commit or version reference for the upstream material I'm working from. Not "based on the upstream repo" — the specific commit, so the agent and any human reviewer can check the exact same source.

**Scope:** what's in this PR and explicitly what's not, with reasons for each exclusion. The out-of-scope section does the most work. When I've made a deliberate decision to omit something — a parameter that's ambient context, a tool that belongs in a different article, a behavior that's implementation-specific — that decision needs to be visible in the PR.

**Open questions:** things I'm genuinely uncertain about, stated directly. "I treated `query_timeout` as an ambient parameter rather than including it in the table — is this consistent with how it's handled in `storage_read`?" That's a direct question to the reviewer. The agent either confirms the pattern or flags the deviation. Either way I get a clear answer, not a guess.

**Reviewer notes:** the standards I've already learned from previous PRs in this content area. This tells the agent and any human reviewer what baseline I'm working from, so flags from this PR add to the baseline rather than re-explaining conventions I've already incorporated.

The "Open questions" section changes the review from "here is my work, please approve" to "here is my work, here are my decisions, here are the places I wasn't certain — confirm or correct." It produces a more useful review because the agent can address a direct question precisely rather than having to detect a silent assumption.

There's a side effect I didn't anticipate when I started writing PRs this way: the scope and open-questions sections catch my own drift before submission. Three times in the last six weeks, writing out the scope and excluded items, I noticed I'd edited files that weren't in my stated goal. Two were legitimate scope expansions I should have documented. One was an accidental holdover from an earlier edit session that I reverted before submitting. The description-writing does a pre-review.

Writing for a specific, thoughtful reviewer changes how you think about what you're doing. The rubber-stamp model lets you be vague because the reviewer will fill in gaps. The cross-team agent model requires precision because the agent will check exactly what you said against exactly what the standards expect.

---

## What This Doesn't Replace

Cross-team agent reviews handle the documented standards consistently. They don't handle the things that aren't documented yet.

If the platform team made an architectural decision last month that changed how a category of parameters should be documented, and their reviewer notes haven't been updated to reflect it, their agent won't flag violations of the new approach. The PR will pass their agent review and still be wrong against the current thinking. That requires a human reviewer who knows the current state of the architecture, not just the captured state of the standards.

The gap between "what the agent knows" and "what the team currently thinks" is permanent and real. Teams evolve faster than reviewer notes. The agent is always applying yesterday's captured knowledge. For stable, well-defined content areas with slow-changing conventions, the gap is small. For areas in active architectural change, it can be significant.

Agent reviews also don't catch conceptual errors. If I've misunderstood what a tool does at the API level, the agent will verify that my documentation accurately describes my misunderstanding. It checks my descriptions against the documented standard, not against the operational reality. Someone who's actually used the tool in production catches the gap between the documentation and the truth.

My approach: agent review on every cross-team PR. Human review from someone on the receiving team on anything involving a new content pattern I haven't documented before, a judgment call about scope or architecture, or the first few PRs in a content area where I'm establishing my baseline. The agent handles the documented-standards enforcement; the human handles the delta between the documented standards and current reality. Both are necessary. The agent's consistency makes the human review more efficient — by the time a PR reaches human review, the pattern and convention questions are already resolved.

When I'm making a deliberate exception to a flagged standard — an edge case I think justifies the deviation — I explain it in the PR description. Not for the agent, which will flag the deviation regardless. For the human who reads the PR later and needs to know whether the exception was intentional and why it was made.

---

## What I've Found From Being On the Receiving End

The first time a cross-team agent gave me 6 flags, my instinct was to feel like I'd done something wrong. Six flags on a PR sounds like a problem.

It wasn't. It was five rules I hadn't known and one ambiguous call I now had a clear answer to. The PR before it got "LGTM." I'd violated the same five patterns in that PR too. The "LGTM" just didn't tell me.

After ten PRs to the platform team's content area, my reviewer notes for that area are substantial. Each entry started as a flag from their agent. The flags have slowed — not because I'm submitting lower-risk PRs, but because the conventions I was violating in the first three PRs are now in my documented baseline. A colleague starting on cross-team PRs to that area can start from my reviewer notes rather than making the first-five-PR mistakes I made. That's not the same as having one of the platform team's experts walk them through the standards — it's a starting point, a documented baseline, something to build from rather than nothing.

The part I'm still working on: a way to be notified when a team updates their reviewer configuration in ways that affect my established rules. Right now I find out on the next PR when their agent flags a pattern I thought was settled. That's fine — it's a correction mechanism — but proactive notification would be better. I'm submitting to three teams with active agent reviews right now and the reactive-correction approach works. If I were at five or six, I'd be spending more time on the catch-up than on the submissions.

Six flags with reasoning is worth more than a hundred silent approvals.
