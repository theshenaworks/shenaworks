import React from 'react'
import { Icon } from './Icon'

export interface FieldWrapperProps {
  id: string
  label: string
  required?: boolean
  optionalText?: boolean
  helpText?: string
  errorText?: string
  successText?: string
  className?: string
  children: React.ReactNode
}

export function FieldWrapper({
  id,
  label,
  required = false,
  optionalText = false,
  helpText,
  errorText,
  successText,
  className = '',
  children,
}: FieldWrapperProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <label htmlFor={id} className="t-field-label">
        {label}
        {required && (
          <>
            <span className="text-[var(--accent-500)] ml-1" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
        {!required && optionalText && (
          <span className="font-normal text-[var(--ink-600)] ml-1.5">(optional)</span>
        )}
      </label>
      {helpText && (
        <p id={`${id}-help`} className="t-field-help">
          {helpText}
        </p>
      )}
      {children}
      {errorText && (
        <p id={`${id}-error`} className="t-field-help text-[var(--error)] flex items-center gap-2" role="alert">
          <Icon name="alert" size={16} />
          <span>{errorText}</span>
        </p>
      )}
      {!errorText && successText && (
        <p id={`${id}-success`} className="t-field-help text-[var(--success)] flex items-center gap-2">
          <Icon name="check" size={16} />
          <span>{successText}</span>
        </p>
      )}
    </div>
  )
}

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  helpText?: string
  errorText?: string
  optionalText?: boolean
  wrapperClassName?: string
}

export function TextInput({
  id,
  label,
  required,
  optionalText,
  helpText,
  errorText,
  wrapperClassName = '',
  className = '',
  ...rest
}: TextInputProps) {
  const describedBy = [helpText ? `${id}-help` : null, errorText ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      optionalText={optionalText}
      helpText={helpText}
      errorText={errorText}
      className={wrapperClassName}
    >
      <input
        id={id}
        required={required}
        aria-invalid={errorText ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        className={`field-input ${className}`.trim()}
        {...rest}
      />
    </FieldWrapper>
  )
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  helpText?: string
  errorText?: string
  optionalText?: boolean
  wrapperClassName?: string
}

export function Textarea({
  id,
  label,
  required,
  optionalText,
  helpText,
  errorText,
  wrapperClassName = '',
  className = '',
  ...rest
}: TextareaProps) {
  const describedBy = [helpText ? `${id}-help` : null, errorText ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      optionalText={optionalText}
      helpText={helpText}
      errorText={errorText}
      className={wrapperClassName}
    >
      <textarea
        id={id}
        required={required}
        aria-invalid={errorText ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        className={`field-textarea ${className}`.trim()}
        {...rest}
      />
    </FieldWrapper>
  )
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  prompt?: string
  options: SelectOption[]
  helpText?: string
  errorText?: string
  optionalText?: boolean
  wrapperClassName?: string
}

export function Select({
  id,
  label,
  prompt,
  options,
  required,
  optionalText,
  helpText,
  errorText,
  wrapperClassName = '',
  className = '',
  value,
  defaultValue,
  ...rest
}: SelectProps) {
  const describedBy = [helpText ? `${id}-help` : null, errorText ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      optionalText={optionalText}
      helpText={helpText}
      errorText={errorText}
      className={wrapperClassName}
    >
      <div className="relative">
        <select
          id={id}
          required={required}
          value={value}
          defaultValue={value === undefined ? defaultValue ?? '' : undefined}
          aria-invalid={errorText ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          className={`field-input appearance-none pr-12 truncate ${className}`.trim()}
          {...rest}
        >
          {prompt && (
            <option value="" disabled={required}>
              {prompt}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-900)]">
          <Icon name="chevron-down" size={18} />
        </span>
      </div>
    </FieldWrapper>
  )
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
  label: React.ReactNode
  errorText?: string
}

export function Checkbox({ id, label, required, errorText, className = '', ...rest }: CheckboxProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <label
        htmlFor={id}
        className="group relative flex items-center min-h-[4.4rem] pl-11 pr-3 cursor-pointer select-none t-body"
      >
        <input
          id={id}
          type="checkbox"
          required={required}
          aria-invalid={errorText ? 'true' : undefined}
          aria-describedby={errorText ? `${id}-error` : undefined}
          className="peer absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 cursor-pointer z-10"
          {...rest}
        />
        <span
          aria-hidden="true"
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 border-2 ${
            errorText ? 'border-[var(--error)]' : 'border-[var(--ink-900)]'
          } bg-transparent transition-colors duration-200 group-hover:bg-[var(--grey-100)] peer-active:bg-[var(--grey-300)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ring)] peer-disabled:border-[var(--grey-400)] flex items-center justify-center`}
        >
          <span className="w-4 h-4 bg-[var(--accent-500)] border-2 border-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
        </span>
        <span className="peer-disabled:text-[var(--grey-500)]">
          {label}
          {required && (
            <>
              <span className="text-[var(--accent-500)] ml-1" aria-hidden="true">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </span>
      </label>
      {errorText && (
        <p id={`${id}-error`} className="t-field-help text-[var(--error)] flex items-center gap-2" role="alert">
          <Icon name="alert" size={16} />
          <span>{errorText}</span>
        </p>
      )}
    </div>
  )
}
