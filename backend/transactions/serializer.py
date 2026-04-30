from rest_framework import serializers
from .models import Request, Transaction


class TransactionSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)

    class Meta:
        model = Transaction
        fields = ('id', 'sender', 'sender_username', 'receiver', 'receiver_username', 'amount', 'transaction_at')
        read_only_fields = ('id', 'sender', 'transaction_at')


class RequestSerializer(serializers.ModelSerializer):
    requester_username = serializers.CharField(source='requester.username', read_only=True)
    payer_username = serializers.CharField(source='payer.username', read_only=True)

    class Meta:
        model = Request
        fields = ('id', 'requester', 'requester_username', 'payer', 'payer_username', 'amount', 'purpose', 'status', 'request_at')
        read_only_fields = ('id', 'requester', 'status', 'request_at')
        

