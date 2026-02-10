'use client';

import React from 'react';
import Image from 'next/image';
import { useConversation } from '../context/ConversationContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ResetButton from './ResetButton';

function MessageCounter() {
  const { state, maxMessages } = useConversation();

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`text-xs font-medium tabular-nums ${
          state.isLimitReached
            ? 'text-red-400'
            : state.messageCount >= maxMessages - 5
            ? 'text-amber-400'
            : 'text-gray-500'
        }`}
        aria-label={`${state.messageCount} of ${maxMessages} messages used`}
      >
        {state.messageCount}/{maxMessages}
      </span>
    </div>
  );
}

function WelcomePanel() {
  return (
    <div className="hidden md:flex relative w-full md:w-1/2 rounded-2xl overflow-hidden min-h-0 flex-1">
      {/* Background image */}
      <Image
        src="/new-bg.png"
        alt="California coastline"
        fill
        className="object-cover"
        priority
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-8 md:p-10 text-white">
        <div>
          <h2 className="font-beausite text-2xl md:text-3xl leading-tight mb-6">
            Stagwell is pleased to present our proposal for Visit California.
          </h2>
          <p className="text-sm md:text-base leading-relaxed opacity-90 mb-8">
            Powered by The Machine, and bringing together the combined expertise of Code and Theory, Crispin, and Assembly into a single system designed to transform your global brand.
          </p>
        </div>
        <div>
          <p className="text-sm md:text-base mb-4">
            Ask me about our proposed approach:
          </p>
          <ul className="space-y-2 text-sm md:text-base opacity-90">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
              How is the integrated team set up and how do we work together?
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
              What would you do in the first 30/60/90 days to build momentum?
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
              How will you evolve the platform and prove incrementality?
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
              How does The Machine support the work practically, in day-to-day delivery?
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  return (
    <div className="flex flex-col h-screen max-h-screen bg-brand-black">
      {/* Header */}
      <header className="flex-shrink-0 px-6 h-[95px]">
        <div className="flex items-center justify-between h-full">
          <Image
            src="/machine-logo.png"
            alt="The Machine"
            width={135}
            height={24}
            className="h-[21px] w-auto"
            priority
          />
          <div className="flex items-center gap-3">
            <MessageCounter />
            <ResetButton />
          </div>
        </div>
      </header>

      {/* Grey divider line */}
      <div className="mx-6 border-t border-grey-line" />

      {/* Subheader */}
      <div className="px-6 py-[20px]">
        <h1 className="font-aeonik-fono text-brand-orange text-xs md:text-sm tracking-[0.2em] uppercase">
          Visit California RFP Agent
        </h1>
      </div>

      {/* Main content: two-column layout */}
      <div className="flex-1 flex gap-4 px-4 md:px-6 pb-4 md:pb-6 min-h-0">
        {/* Welcome panel - hidden on mobile */}
        <WelcomePanel />

        {/* Chat window */}
        <div className="flex flex-col w-full md:w-1/2 bg-dark-grey rounded-2xl overflow-hidden min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <MessageList />
          </div>

          {/* Input */}
          <div className="flex-shrink-0">
            <MessageInput />
          </div>
        </div>
      </div>
    </div>
  );
}
