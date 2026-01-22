section .text

global _start

_start:
    move rax, 60
    xor rdi,rdi
    syscall

