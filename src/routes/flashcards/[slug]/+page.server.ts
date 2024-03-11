import { prisma } from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Session } from '@auth/core/types';
import { generateFlashCards } from '$lib/server/formatter';
import type { Project } from '@prisma/client';
import type { Flashcard } from '$lib/server/types/Flashcard';

export const load: PageServerLoad = async (event) => {
	const session: Session | null = await event.locals.auth();
	if (!session?.user) throw redirect(303, '/');

	const slug = event.params.slug;

	const project: Project | null = await prisma.project.findUnique({
		where: {
			id: Number(slug)
		}
	});

	if (project == null) error(503, 'Unable to fetch project details. Please try again later.');

	const fullSummary = () => {
		const summaryData = JSON.parse(JSON.stringify(project.data));
		let summary = '';
		if (project.hasSlides) {
			summaryData.forEach((item) => {
				const itemType = typeof item.summaries;
				
				if (itemType == 'string') {
					summary = summary + item.summaries;
				} else
					item.summaries.forEach((summary_object) => {
						summary = summary + ' ' + summary_object;
					});
			});
		} else {
			summary = summaryData.summary;
		}
        //console.log(summary);
		return summary.toString();
	};

	async function getFlashCardsString() {
		const summary: string = fullSummary();
		const flashCardsString = await generateFlashCards(summary);
		//console.log('Flash Cards STring: ' + flashCardsString);
		return flashCardsString;
	}

	function parseFlashcards(cardsString: string) {
		// Format should be Font:... Back:...
		const flashCards: Flashcard[] = [];

		const parts = cardsString.split('Front:');
		for (let i = 1; i <= parts.length - 1; i++) {
			if (parts[i]) {
				const [front, back] = parts[i].trim().split('Back:');
				const card: Flashcard = {
					front: front,
					back: back
				};
				flashCards.push(card);
			}
			const [front, back] = parts[i].trim().split('Back:');
			const card: Flashcard = {
				front: front,
				back: back
			};
			flashCards.push(card);
		}
		return flashCards;
	}
	const flashCards: Flashcard[] = parseFlashcards((await getFlashCardsString()) ?? '');

	//console.log("Parsed Flash Cards;> " + printFlashCards(flashCards));

	return { project, flashCards };
};

function printFlashCards(flashCards: Flashcard[]) {
	let print = '';
	flashCards.forEach((card) => {
		print += 'asfront:' + card.front + ' ssback: ' + card.back;
	});
	return print;
}
