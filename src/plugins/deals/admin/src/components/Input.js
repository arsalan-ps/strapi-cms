import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import { IconButton, Icon, Combobox, ComboboxOption, SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { Trash, Pencil, Drag, Cross, Check, Plus } from "@strapi/icons"

const Label = styled.span`
	font-size: 0.75rem;
	line-height: 1.33;
	font-weight: 600;
	color: #ffffff;
`

const LabelContainer = styled.div`
  display: flex;
  justify-content: flex-start;
	margin-bottom: 0.25rem;
`;

const MainContainer = styled.div`
	display: flex; 
	flex-direction: column; 
	gap: 2rem;
	border: 1px solid rgb(74, 74, 106);
	padding: 1.5rem;
	border-radius: 4px;
`;

const EditContainer = styled.div`
	display: flex;
	flex-direction: column; 
	gap: 2rem; 
`

const ViewContainer = styled.div`
	display: flex;
	gap: 2rem; 
	align-items: center;
`

const TextareaContainer = styled.div`
	flex: 0 0 52%;
	border-radius: 4px;
	border: 1px solid rgb(74, 74, 106);

	:focus-within {
		border: 1px solid rgb(123, 121, 255);
		box-shadow: rgb(123, 121, 255) 0px 0px 0px 2px;
	}
`;

const Textarea = styled.textarea`
	width: 100%;
	resize: none;
	font-size: 0.875rem;
	background: rgb(33, 33, 52);
	color: rgb(255, 255, 255);
	padding: 16px;
	border: none;
	outline: none;
	border-radius: 4px;
	height: 4rem;
	line-height: 1.43;
`

const ComboboxContainer = styled.div`
	flex: 0 0 80%;
`

const ButtonsContainer = styled.div`
	flex: 0 0 15%;
	display: flex;
	gap: 1rem;
`

const DragHandle = styled.div`
	cursor: pointer;
`

const ControlsContainer = styled.div`
display: flex; 
justify-content: space-between; 
align-items: flex-end
`;

const slugs = [
	{ name: "handyman", value: "handyman" },
	{ name: "boxers", value: "boxers" },
	{ name: "trimmer", value: "trimmer" },
	{ name: "beard-oil", value: "beard-oil" },
]

const productAttributes = [
	{ name: "title", value: "title" },
	{ name: "freeGiftPrice", value: "freeGiftPrice" }
]

function getInitialValue(value) {
	if (value === "null" || value === null || value === undefined) {
		return []
	}

	return JSON.parse(value);
}

export default function Input({
	name,
	attribute,
	onChange,
	value
}) {
	const initialValue = getInitialValue(value)
	const [data, setData] = useState(initialValue);
	const [slug, setSlug] = useState("");
	const [productAttribute, setProductAttribute] = useState("");
	const [content, setContent] = useState("");
	const [editingIndex, setEditingIndex] = useState(-1);
	const [draggedItem, setDraggedItem] = useState(null);

	const inputRef = useRef(null);

	const handleDragStart = (index) => {
		if (index !== editingIndex) {
			setDraggedItem(data[index]);
		}
	};

	const handleDragOver = (event, index) => {
		event.preventDefault();
		const draggedOverItem = data[index];

		if (draggedItem === draggedOverItem || index === editingIndex) {
			return;
		}

		const newData = data.filter((item) => item !== draggedItem);
		const updatedData = [
			...newData.slice(0, index),
			draggedItem,
			...newData.slice(index)
		];

		setData(updatedData);
		onChange({
			target: { name, value: JSON.stringify(updatedData), type: attribute.type },
		})
	};

	const handleDragEnd = () => {
		setDraggedItem(null);
	};

	const handleEditClick = (index) => {
		setEditingIndex(index);
		setContent(data[index].content);
		setSlug(data[index].slug)
	};

	const handleSaveClick = (index) => {
		if (!content.trim()) {
			alert("Content cannot be empty. Please enter some value.");
			return;
		}

		const newData = [...data];
		newData[index].content = content;
		newData[index].slug = slug;
		setData(newData);

		onChange({
			target: { name, value: JSON.stringify(newData), type: attribute.type },
		})

		setEditingIndex(-1);
		setContent("");
		setSlug("");
		setProductAttribute("")
	};

	const handleDeleteClick = (index) => {
		const newData = [...data];
		newData.splice(index, 1);
		setData(newData);
		onChange({
			target: { name, value: JSON.stringify(newData), type: attribute.type },
		})
	};

	function onTextChange(event) {
		const textValue = event.target.value
		setContent(textValue);
	}

	const handleAddClick = () => {
		if (data.length > 0 && !data[data.length - 1].content.trim()) {
			alert("Please enter some value in the previous row and save it before adding a new one.");
			return;
		}

		setData([...data, { slug: "", content: "" }]);
		setEditingIndex(data.length);
		setContent("");
		setSlug("")
	};

	const handleCancelClick = () => {
		if (editingIndex === data.length - 1 && !data[editingIndex].content.trim()) {
			// If the current row is a newly added row with empty content, remove it from the data state
			setData((prevData) => prevData.slice(0, -1));
		}

		setEditingIndex(-1);
		setContent("");
		setSlug("");
		setProductAttribute("")
	}

	// const handleSlugChange = (selectedValue) => {
	// 	if (selectedValue) {
	// 		setSlug(selectedValue);
	// 	}
	// };

	// const handleProductAttributeChange = (selectedValue) => {
	// 	if (selectedValue) {
	// 		setContent((prevContent) => {
	// 			const input = inputRef.current;
	// 			const startPos = input.selectionStart;
	// 			const endPos = input.selectionEnd;
	// 			const newContent =
	// 				prevContent.slice(0, startPos) +
	// 				`{{${slug}.${selectedValue}}}` +
	// 				prevContent.slice(endPos);
	// 			return newContent;
	// 		});
	// 		setProductAttribute(selectedValue)
	// 	}
	// }

	const handleProductAttributeChange = (selectedValue) => {
		if (selectedValue) {
			setContent((prevContent) => {
				const input = inputRef.current;
				const startPos = input.selectionStart;
				const endPos = input.selectionEnd;
				const newContent =
					prevContent.slice(0, startPos) +
					`{{product_slug.${selectedValue}}}` +
					prevContent.slice(endPos);
				return newContent;
			});
			setProductAttribute(selectedValue)
		}
	}

	return (
		<React.Fragment>
			<LabelContainer>
				<Label>Add Products</Label>
			</LabelContainer>
			<MainContainer>
				{data.map((item, index) => (
					<div key={index}>
						{editingIndex !== index ? (
							<ViewContainer>
								<DragHandle
									draggable={editingIndex !== index}
									onDragStart={() => handleDragStart(index)}
									onDragOver={(event) => handleDragOver(event, index)}
									onDragEnd={handleDragEnd}
								>
									<Icon width="1rem" height="1rem" as={Drag} />
								</DragHandle>
								<TextareaContainer>
									<Textarea
										key={index}
										readOnly
										value={item.content}
									/>
								</TextareaContainer>
								<ButtonsContainer>
									<IconButton onClick={() => handleEditClick(index)} label="Edit" icon={<Pencil />} />
									<IconButton onClick={() => handleDeleteClick(index)} label="Delete" icon={<Trash />} />
								</ButtonsContainer>
							</ViewContainer>
						) : (
							<EditContainer>
								<ControlsContainer>
									{/* <ComboboxContainer>
										<Combobox value={slug} onChange={handleSlugChange} placeholder="select slug" label="Product Slug">
											{slugs.map((slug) => (
												<ComboboxOption key={slug.value} value={slug.value}>{slug.name}</ComboboxOption>
											))}
										</Combobox>
									</ComboboxContainer> */}
									<ComboboxContainer>
										<SingleSelect value={productAttribute} onChange={handleProductAttributeChange} placeholder="select attribute" label="Product Attribute">
											{productAttributes.map((productAttribute) => (
												<SingleSelectOption key={productAttribute.value} value={productAttribute.value}>{productAttribute.name}</SingleSelectOption>
											))}
										</SingleSelect>
									</ComboboxContainer>
									<ButtonsContainer>
										<IconButton onClick={() => handleSaveClick(index)} label="Save" icon={<Check />} />
										<IconButton onClick={() => handleCancelClick()} label="Cancel" icon={<Cross />} />
									</ButtonsContainer>
								</ControlsContainer>
								<TextareaContainer>
									<Textarea
										ref={inputRef}
										placeholder="Enter value"
										onChange={onTextChange}
										value={content}
									/>
								</TextareaContainer>
							</EditContainer>
						)}
					</div >
				))}

				<div style={{ display: "flex", justifyContent: "center" }}>
					<IconButton onClick={() => handleAddClick()} label="Add" icon={<Plus />} />
				</div>
			</MainContainer>
		</React.Fragment>
	)
}
