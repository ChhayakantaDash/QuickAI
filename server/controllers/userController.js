import sql from "../configs/db.js"

export const getUserCreation = async (req, res) => {
    try {
        const { userId } = req.auth()
        const creations = await sql`SELECT * FROM creations WHERE user_id=${userId} ORDER BY created_at DESC`
        res.json({ success: true, creations })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

export const getPublishedCreation = async (req, res) => {
    try {

        const creations = await sql`SELECT * FROM creations WHERE publish=true ORDER BY created_at DESC`
        res.json({ success: true, creations })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

export const toggleLikeCreation = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body

        const [creation] = await sql`SELECT * FROM creations WHERE id=${id}`
        if (!creation) {
            return res.json({ success: false, message: 'Creation not found' })
        }

        const likesArray = creation.likes || []
        const userIdStr = userId.toString()
        let updatedLikes, message

        if (likesArray.includes(userIdStr)) {
            updatedLikes = likesArray.filter(id => id !== userIdStr)
            message = 'Like removed'
        } else {
            updatedLikes = [...likesArray, userIdStr]
            message = 'Like added'
        }

        await sql`UPDATE creations SET likes=${updatedLikes} WHERE id=${id}`

        res.json({ success: true, creation: { ...creation, likes: updatedLikes }, message })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
