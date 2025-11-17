import {ForwardedRef, forwardRef, ForwardRefExoticComponent, JSX, PropsWithoutRef} from 'react';
import clsx from "clsx";
import {Optional, SelectOption} from "../../domain/types/steoreotype.ts";

export interface SelectParams extends PropsWithoutRef<JSX.IntrinsicElements["select"]> {
    className?: string;
    label: Optional<string>;
    error: Optional<string>;
    options: SelectOption[];
}

const SelectRender = ({error, label, options, ...props}: SelectParams, ref: ForwardedRef<HTMLSelectElement>) => {
    const labelClassName: string = clsx('form-label text-md mb-1', {
        'text-red-500': Boolean(error),
    });

    return (
        <div className={clsx('relative', props.className)}>
            {label && (
                <div className="relative w-fit">
                    <label htmlFor={props.id} className={labelClassName}>
                        {label}
                    </label>
                </div>
            )}
            <select ref={ref} {...props}
                   required={false} className={clsx('select bg-transparent', {
                'border-red-500': Boolean(error)
            })}>
                <option value="">Seleccione...</option>
                {options.map((option) => (
                    <option key={String(option.value)} value={String(option.value)}>
                        {option.description}
                    </option>
                ))}
            </select>

            {error &&
                (
                    <p className="text-red-500 text-xs absolute right-0">
                        <i className="fa fa-warning mr-1"/>
                        {error}
                    </p>
                )
            }
        </div>
    );
}

export const Select: ForwardRefExoticComponent<SelectParams> = forwardRef(SelectRender);

