'use client';

import { useState } from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { ResponsiveModal } from '@/components/responsive-dialog';

interface UseConfirmProps {
	title: string;
	message: string;
	variant?: ButtonProps['variant'];
}

export const useConfirm = ({
	title,
	message,
	variant = 'destructive',
}: UseConfirmProps): [() => React.JSX.Element, () => Promise<boolean>] => {
	const [isOpen, setIsOpen] = useState(false);
	const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

	const confirm = () => {
		setIsOpen(true);
		return new Promise<boolean>((resolve) => {
			setResolver(() => resolve);
		});
	};

	const handleClose = () => {
		setIsOpen(false);
		resolver?.(false);
		setResolver(null);
	};

	const handleConfirm = () => {
		setIsOpen(false);
		resolver?.(true);
		setResolver(null);
	};

	const ConfirmationDialog = () => (
		<ResponsiveModal
			title={title}
			open={isOpen}
			onOpenChange={handleClose}
		>
			<div className='flex flex-col gap-2'>
				<p className='text-sm text-muted-foreground'>{message}</p>

				<div className='flex w-full items-center justify-end gap-2 pt-4'>
					<Button onClick={handleClose} variant='outline'>
						Cancel
					</Button>

					<Button onClick={handleConfirm} variant={variant}>
						Confirm
					</Button>
				</div>
			</div>
		</ResponsiveModal>
	);

	return [ConfirmationDialog, confirm];
};

