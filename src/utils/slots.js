import { app } from '@/main'

async function getSlots(gravity, pollId) {
    const api = app.config.globalProperties.COSMO_API
    const res = await fetch(
        `${api}/gravity/v3/${gravity.artist}/gravity/${gravity.id}/polls/${pollId}`,
        { headers: { "Authorization": "Bearer " + import.meta.env.VITE_COSMO_TOKEN } }
    )
    const data = await res.json()

    const result = []

    if (data.pollDetail.type === 'combination-poll') {
        const choices = data.pollDetail.pollViewMetadata.slotChoices
        const table = data.pollDetail.pollViewMetadata.choiceIdToSlotChoicesMapTable
        const slots = data.pollDetail.pollViewMetadata.slots

        table.forEach((mapping) => {
            mapping.slotIds.forEach((slot, index) => {
                const choiceName = choices.find(c => c.id === mapping.slotChoiceIds[index]).name
                const slotName = slots.find(s => s.id === slot).name

                if (!result.find(s => s.name === slotName))
                    result.push({ name: slotName, choices: [] })
                const slotIndex = result.findIndex(s => s.name === slotName)
                
                if (!result[slotIndex].choices.find(c => c.name === choiceName))
                    result[slotIndex].choices.push({ name: choiceName, ids: [] })
                const choice = result[slotIndex].choices.findIndex(c => c.name === choiceName)

                result[slotIndex].choices[choice].ids.push(mapping.choiceId)
            })
        })
    } else {
        result.push({choices: data.pollDetail.choices.map(c => ({name: c.title, ids: [c.id]}))})
    }

    return {
        slots: result,
        candidates: data.pollDetail.choices.map(choice => choice.id)
    }
}

export default getSlots