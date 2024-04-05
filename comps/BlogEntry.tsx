import * as React from "react"
import View, { ViewProps } from "comps/View"
import Text from "comps/Text"
import Image from "next/image"

interface BlogEntryProps {
	title: string;
	author: string;
	date: string;
	description: string;
	image: string;
}

const MOBILE = 640

const BlogEntry: React.FC<BlogEntryProps & ViewProps> = ({
	title,
	author,
	date,
	description,
	image,
}) => {
	return (
		<View stretchX outlined rounded height={180} dir="row" bg={3} pad={1} gap={2} css={{
			[`@media (max-width: ${MOBILE}px)`]: {
				flexDirection: "column",
				height: "auto",
			},
		}}>
			<Image src={image} 
				width={200} height={200}
				alt={title}
				css={{
					borderRadius: 8,
					width: "20%",
					height: "100%",
					objectFit: "cover",
					display: "block",
					[`@media (max-width: ${MOBILE}px)`]: {
						width: "100%",
						height: 200,
					},
				}}
			/>
			<View gap={0.5} dir="column">
				<Text size="huge">{title}</Text>
				<Text size="small" italic color={3}>{author}, {date}</Text>
				<Text size="normal">{description}</Text>
			</View>
		</View>
	)
}

export default BlogEntry
